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

// Endpoint Profile Update
router.put('/', authenticateJWT, async (req, res) => {
    const { first_name, last_name, profile_image } = req.body;

    try {
        // Update data pengguna berdasarkan email dari payload JWT
        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            { first_name, last_name, profile_image },
            { new: true } // Mengembalikan dokumen yang diperbarui
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 104,
                message: "Pengguna tidak ditemukan",
                data: null
            });
        }

        // Mengembalikan data pengguna yang telah diperbarui
        return res.status(200).json({
            status: 0,
            message: "Update Profile berhasil",
            data: {
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                profile_image: updatedUser.profile_image
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;