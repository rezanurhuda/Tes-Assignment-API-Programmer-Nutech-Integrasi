const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User
const path = require('path');
const fs = require('fs');
const { JWT_SECRET } = require('../config'); // Import JWT_SECRET dari config

const router = express.Router();

// Konfigurasi multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder untuk menyimpan file yang diupload
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate nama unik
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Jenis format gambar yang bisa diupload
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File type not supported'));
    }
});

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

// Endpoint untuk memperbarui gambar profil
router.put('/', authenticateJWT, upload.single('profile_image'), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({
                status: 104,
                message: "Pengguna tidak ditemukan",
                data: null
            });
        }

        // Simpan URL gambar ke database
        user.profile_image = req.file.path; // Ganti URL jika menggunakan cloud storage
        await user.save();

        return res.status(200).json({
            status: 0,
            message: "Update Profile Image berhasil",
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        });
    } catch (error) {
        console.error('Error updating profile image:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;