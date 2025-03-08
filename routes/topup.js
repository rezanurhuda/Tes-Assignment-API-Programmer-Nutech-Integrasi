const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import Transaction model
const router = express.Router();
const { JWT_SECRET } = require('../config');

// Middleware untuk otentikasi JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: 108,
                    message: "Token tidak valid atau kadaluwarsa",
                    data: null
                });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({
            status: 108,
            message: "Token tidak valid atau kadaluwarsa",
            data: null
        });
    }
};

// Generate invoice number for topup
const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `INV${day}${month}${year}-${random}`;
};

// Endpoint Topup
router.post('/', authenticateJWT, async (req, res) => {
    // Convert top_up_amount to a number explicitly
    const topUpAmount = Number(req.body.top_up_amount);

    // Validasi jumlah top-up
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
        return res.status(400).json({
            status: 102,
            message: "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
            data: null
        });
    }

    try {
        // Cari pengguna berdasarkan email dari payload JWT
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({
                status: 104,
                message: "Pengguna tidak ditemukan",
                data: null
            });
        }
        
        // Then add the top-up amount
        user.balance += topUpAmount;
        
        // Generate invoice number for this topup
        const invoice_number = generateInvoiceNumber();
        
        // Create transaction record for topup
        const transaction = new Transaction({
            invoice_number,
            email: user.email,
            service_code: 'TOPUP',
            service_name: 'Top Up Balance',
            transaction_type: 'TOPUP',
            total_amount: topUpAmount,
            created_on: new Date()
        });
        
        // Save transaction record
        await transaction.save();
        
        // Save the user changes
        await user.save();

        return res.status(200).json({
            status: 0,
            message: "Top Up Balance berhasil",
            data: {
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Error during top-up:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;