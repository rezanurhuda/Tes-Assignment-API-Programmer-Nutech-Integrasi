const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const Transaction = require('../models/Transaction');
const { authenticateJWT } = require('../middleware/auth');
const { generateInvoiceNumber } = require('../utils/helpers');

// Endpoint untuk melakukan transaksi pembayaran
// POST /transaction
router.post('/', authenticateJWT, async (req, res) => {
    const { service_code } = req.body;

    // Validasi input dasar
    if (!service_code) {
        return res.status(400).json({
            status: 102,
            message: "Parameter service_code tidak boleh kosong",
            data: null
        });
    }

    try {
        // Ambil data pengguna dari database
        const user = await User.findOne({ email: req.user.email });
        
        if (!user) {
            return res.status(404).json({
                status: 104,
                message: "Pengguna tidak ditemukan",
                data: null
            });
        }

        // Ambil data layanan dari database
        const service = await Service.findOne({ service_code });
        
        if (!service) {
            return res.status(400).json({
                status: 102,
                message: "Service atau Layanan tidak ditemukan",
                data: null
            });
        }

        // Cek apakah saldo mencukupi
        if (user.balance < service.service_tarif) {
            return res.status(400).json({
                status: 102,
                message: "Saldo tidak mencukupi",
                data: null
            });
        }

        // Buat nomor invoice unik
        const invoice_number = generateInvoiceNumber();

        // Buat record transaksi baru
        const transaction = new Transaction({
            invoice_number,
            email: user.email,
            service_code: service.service_code,
            service_name: service.service_name,
            transaction_type: "PAYMENT",
            total_amount: service.service_tarif,
            created_on: new Date()
        });

        // Simpan transaksi ke database
        await transaction.save();

        // Update saldo pengguna
        user.balance -= service.service_tarif;
        await user.save();

        // Kirim response sukses dengan data transaksi
        return res.status(200).json({
            status: 0,
            message: "Transaksi berhasil",
            data: {
                invoice_number,
                service_code: service.service_code,
                service_name: service.service_name,
                transaction_type: "PAYMENT",
                total_amount: service.service_tarif,
                created_on: transaction.created_on
            }
        });

    } catch (error) {
        console.error('Error processing transaction:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;