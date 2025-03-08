// middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Middleware untuk memvalidasi JWT token dan mengekstrak data pengguna
// Digunakan untuk melindungi endpoint yang membutuhkan otentikasi
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak ditemukan",
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

        // Simpan data pengguna dari token ke request
        req.user = user;
        next();
    });
};

module.exports = { authenticateJWT };