const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User
const router = express.Router();
const { JWT_SECRET } = require('../config'); // Import JWT_SECRET dari config

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

            req.user = user; // Simpan informasi pengguna di request
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

// Endpoint untuk mendapatkan balance
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({
                status: 104,
                message: "Pengguna tidak ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: {
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Error retrieving user balance:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;