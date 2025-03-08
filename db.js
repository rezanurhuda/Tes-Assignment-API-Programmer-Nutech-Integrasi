const mongoose = require('mongoose');
const { DB_URI } = require('./config');

// Koneksi ke MongoDB database
// Menggunakan best practice terbaru dari Mongoose
const connectDB = async () => {
    try {
        // Opsi koneksi untuk mengatasi depresiasi dari MongoDB driver
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB berhasil terhubung');
    } catch (error) {
        console.error('Gagal terhubung ke MongoDB:', error.message);
        // Keluar dengan kode error untuk memberi tahu process manager
        process.exit(1);
    }
};

module.exports = connectDB;