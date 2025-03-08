const mongoose = require('mongoose');

// Schema untuk menyimpan semua transaksi dalam sistem
// Baik transaksi pembayaran maupun top-up
const transactionSchema = new mongoose.Schema({
    invoice_number: {
        type: String,
        required: true,
        unique: true // Nomor invoice harus unik di seluruh sistem
    },
    email: {
        type: String,
        required: true // Email pengguna yang melakukan transaksi
    },
    service_code: {
        type: String,
        required: true // Kode layanan yang dibeli atau 'TOPUP' untuk top-up
    },
    service_name: {
        type: String,
        required: true // Nama layanan atau 'Top Up Balance'
    },
    transaction_type: {
        type: String,
        required: true,
        enum: ['PAYMENT', 'TOPUP'] // Hanya mendukung dua tipe transaksi
    },
    total_amount: {
        type: Number,
        required: true // Jumlah uang dalam transaksi
    },
    created_on: {
        type: Date,
        default: Date.now // Tanggal dan waktu transaksi dibuat
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;