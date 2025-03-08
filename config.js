// Kunci rahasia untuk JWT, seharusnya di-load dari environment variable
// Jangan gunakan nilai hardcoded di production!
// TODO: Gunakan process.env.JWT_SECRET saat deployment
const JWT_SECRET = process.env.JWT_SECRET || 'ec112cd18cd3db1219fe3f6057307ed4f7784f57152fb90ac8e21f3663fdb305';

// Konfigurasi database
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutech_integrasi_db';

// Konfigurasi aplikasi
const APP_CONFIG = {
    PORT: process.env.PORT || 3000,
    TOKEN_EXPIRY: '12h',
    UPLOAD_PATH: './uploads'
};

module.exports = {
    JWT_SECRET,
    DB_URI,
    APP_CONFIG
};