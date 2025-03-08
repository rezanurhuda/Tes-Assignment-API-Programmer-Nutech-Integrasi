// Generate nomor invoice dengan format INVddmmyy-xxx
// Digunakan untuk transaksi dan top-up
const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `INV${day}${month}${year}-${random}`;
};

// Validasi format email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validasi panjang password
const isValidPassword = (password) => {
    return password && password.length >= 8;
};

module.exports = {
    generateInvoiceNumber,
    isValidEmail,
    isValidPassword
};