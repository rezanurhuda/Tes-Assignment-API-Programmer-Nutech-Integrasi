const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Harusnya konsisten menggunakan bcrypt atau bcryptjs
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Endpoint untuk proses login pengguna
// POST /login
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    // Validasi format email - sama dengan registrasi
    // Sebaiknya validasi di-extract ke fungsi terpisah untuk reusability
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 102,
            message: "Parameter email tidak sesuai format",
            data: null
        });
    }

    // Validasi panjang password
    if (password.length < 8) {
        return res.status(400).json({
            status: 102,
            message: "Password minimal 8 karakter",
            data: null
        });
    }

    try {
        // Cari pengguna berdasarkan email
        const user = await User.findOne({ email });
        if (!user) {
            // Pesan error yang sama untuk email dan password salah
            // untuk mencegah attacker mengetahui mana yang salah
            return res.status(401).json({
                status: 103,
                message: "Username atau password salah",
                data: null
            });
        }

        // Verifikasi password dengan bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 103,
                message: "Username atau password salah",
                data: null
            });
        }

        // Buat token JWT dengan payload minimal (hanya email)
        const payload = {
            email: user.email
        };

        // Token valid selama 12 jam
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

        return res.status(200).json({
            status: 0,
            message: "Login Sukses",
            data: {
                token: token
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;