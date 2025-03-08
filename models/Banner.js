const mongoose = require('mongoose');

// Schema untuk menyimpan data banner pada aplikasi
// Banner digunakan untuk konten promosi pada halaman utama
const BannerSchema = new mongoose.Schema({
    banner_name: {
        type: String,
        required: true // nama banner wajib diisi
    },
    banner_image: {
        type: String,
        required: true // URL gambar banner wajib diisi
    },
    description: {
        type: String,
        required: true // deskripsi banner untuk informasi tambahan
    }
}, { timestamps: true }); // menambahkan createdAt dan updatedAt secara otomatis

// Membuat model dari schema untuk operasi database
const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;