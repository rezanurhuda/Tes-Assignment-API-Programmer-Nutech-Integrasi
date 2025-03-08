const mongoose = require('mongoose');

// Schema untuk menyimpan data pengguna aplikasi
// Menyimpan informasi penting seperti email, nama, password dan saldo
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Memastikan email tidak duplikat dalam sistem
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true // Password harus di-hash sebelum disimpan
    },
    profile_image: {
        type: String,
        default: null // Path ke gambar profil
    },
    balance: {
        type: Number,
        default: 0 // Saldo awal pengguna
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;