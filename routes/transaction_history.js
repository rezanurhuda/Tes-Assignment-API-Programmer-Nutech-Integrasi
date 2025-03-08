const express = require('express');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const router = express.Router();
const { JWT_SECRET } = require('../config');

// Middleware untuk memverifikasi token JWT
// Memastikan pengguna sudah login sebelum mengakses riwayat transaksi
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak ditemukan pada request",
            data: null
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null
            });
        }

        // Menyimpan data user dari token ke request untuk digunakan pada endpoint
        req.user = user;
        next();
    });
};

// Endpoint untuk mendapatkan riwayat transaksi pengguna
// GET /transaction-history?offset=0&limit=10
router.get('/', authenticateJWT, async (req, res) => {
    try {
        // Mengambil parameter paginasi dari query URL
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;
        
        // Mendapatkan email pengguna dari payload JWT
        const { email } = req.user;
        
        // Membuat query untuk mencari transaksi milik pengguna ini
        const query = { email };
        
        // Mengambil data transaksi dari database dengan paginasi
        const transactions = await Transaction.find(query)
            .sort({ created_on: -1 }) // Urutkan dari transaksi terbaru
            .skip(offset)
            .limit(limit);
        
        // Format data transaksi untuk response API
        const formattedTransactions = formatTransactionData(transactions);
        
        // Mengembalikan response yang berhasil
        return res.status(200).json({
            status: 0,
            message: "Get History Berhasil",
            data: {
                offset,
                limit,
                records: formattedTransactions
            }
        });
        
    } catch (error) {
        console.error('Error retrieving transaction history:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

// Fungsi helper untuk memformat data transaksi sebelum dikirim ke client
// Membuat deskripsi yang lebih mudah dibaca berdasarkan tipe transaksi
function formatTransactionData(transactions) {
    return transactions.map(transaction => {
        // Membuat deskripsi berdasarkan jenis transaksi
        let description;
        if (transaction.transaction_type === 'TOPUP') {
            description = 'Top Up balance';
        } else {
            description = transaction.service_name;
        }
        
        // Mengembalikan data yang sudah diformat
        return {
            invoice_number: transaction.invoice_number,
            transaction_type: transaction.transaction_type,
            description,
            total_amount: transaction.total_amount,
            created_on: transaction.created_on
        };
    });
}

module.exports = router;