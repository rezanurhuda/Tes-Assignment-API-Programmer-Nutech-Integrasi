const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User
const { JWT_SECRET } = require('../config'); // Import JWT_SECRET dari config

const router = express.Router();

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

// Endpoint Profile
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

        // Mengambil data profile_image jika ada di model User
        const userData = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: "https://yoururlapi.com/profile.jpeg"
        };

        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: userData
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;