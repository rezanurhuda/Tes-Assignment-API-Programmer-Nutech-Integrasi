const mongoose = require('mongoose');

// Schema untuk layanan yang tersedia pada aplikasi
// Digunakan untuk menampilkan daftar layanan dan tarif
const serviceSchema = new mongoose.Schema({
    service_code: {
        type: String,
        required: true,
        unique: true // kode layanan harus unik untuk identifikasi
    },
    service_name: {
        type: String,
        required: true // nama layanan untuk ditampilkan ke pengguna
    },
    service_icon: {
        type: String,
        required: true // URL ikon layanan untuk UI
    },
    service_tarif: {
        type: Number,
        required: true // tarif layanan dalam Rupiah
    }
    // TODO: tambahkan field status untuk menandai layanan aktif/non-aktif
});

// Membuat model dari schema untuk operasi database
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;