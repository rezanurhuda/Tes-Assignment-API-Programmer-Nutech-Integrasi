const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Endpoint untuk pendaftaran pengguna baru
// POST /registration
router.post('/', async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    // Validasi format email dengan regex sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 102,
            message: "Parameter email tidak sesuai format",
            data: null
        });
    }

    // Validasi panjang password untuk keamanan minimal
    if (password.length < 8) {
        return res.status(400).json({
            status: 102,
            message: "Password minimal 8 karakter",
            data: null
        });
    }

    try {
        // Cek apakah email sudah terdaftar untuk mencegah duplikasi pengguna
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 102,
                message: "Email sudah terdaftar",
                data: null
            });
        }

        // Hash password untuk keamanan sebelum disimpan ke database
        // Salt 10 memberikan keamanan yang cukup tanpa terlalu berat
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna baru dan simpan ke database
        const newUser = new User({ 
            email, 
            first_name, 
            last_name, 
            password: hashedPassword 
        });
        await newUser.save();

        return res.status(200).json({
            status: 0,
            message: "Registrasi berhasil silahkan login",
            data: null
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            status: 500,
            message: "Terjadi kesalahan pada server",
            data: null
        });
    }
});

module.exports = router;