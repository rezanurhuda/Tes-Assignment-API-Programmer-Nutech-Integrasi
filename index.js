const express = require('express');
const path = require('path');
const connectDB = require('./db');

// Import routes
const registrationRoutes = require('./routes/registration');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const profileUpdateRoutes = require('./routes/profile_update');
const profileImageRoutes = require('./routes/profile_image');
const bannerRoutes = require('./routes/banner');
const serviceRoutes = require('./routes/service');
const balanceRoutes = require('./routes/balance');
const topupRoutes = require('./routes/topup');
const transactionRoutes = require('./routes/transaction');
const transactionHistoryRoutes = require('./routes/transaction_history');

const { APP_CONFIG } = require('./config');

const app = express();
const PORT = APP_CONFIG.PORT;

// Middleware untuk parsing JSON request body
app.use(express.json());

// Middleware untuk file statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Koneksi ke database MongoDB
connectDB();

// Definisi routes
// Endpoint untuk manajemen pengguna
app.use('/registration', registrationRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/profile/update', profileUpdateRoutes);
app.use('/profile/image', profileImageRoutes);

// Endpoint untuk data aplikasi
app.use('/banner', bannerRoutes);
app.use('/service', serviceRoutes);

// Endpoint untuk manajemen saldo dan transaksi
app.use('/balance', balanceRoutes);
app.use('/topup', topupRoutes);
app.use('/transaction', transactionRoutes);
app.use('/transaction/history', transactionHistoryRoutes);

// Root endpoint untuk health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 0,
        message: "API berjalan dengan baik",
        version: "1.0.0"
    });
});

// Endpoint fallback untuk route yang tidak ada
app.use('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Endpoint tidak ditemukan",
        data: null
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});