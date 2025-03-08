-- Skema database untuk aplikasi Nutech Integrasi

-- Tabel pengguna
CREATE TABLE users (
    id VARCHAR(24) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255),
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel banner
CREATE TABLE banners (
    id VARCHAR(24) PRIMARY KEY,
    banner_name VARCHAR(100) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel layanan
CREATE TABLE services (
    id VARCHAR(24) PRIMARY KEY,
    service_code VARCHAR(20) NOT NULL UNIQUE,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tarif DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel transaksi
CREATE TABLE transactions (
    id VARCHAR(24) PRIMARY KEY,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    service_code VARCHAR(20) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    transaction_type ENUM('PAYMENT', 'TOPUP') NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    created_on TIMESTAMP NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (service_code) REFERENCES services(service_code)
);

-- Membuat indeks untuk kolom yang sering digunakan dalam pencarian
CREATE INDEX idx_transactions_email ON transactions(email);
CREATE INDEX idx_transactions_service_code ON transactions(service_code);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_on ON transactions(created_on);