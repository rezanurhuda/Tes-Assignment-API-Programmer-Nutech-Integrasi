const express = require('express');
const Banner = require('../models/Banner'); // Import model Banner
const router = express.Router();

// Endpoint Banner
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find(); // Ambil semua data banner dari database

        if (banners.length === 0) {
            return res.status(404).json({
                status: 104,
                message: "Tidak ada banner ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: banners
        });
    } catch (error) {
        console.error('Error retrieving banners:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;