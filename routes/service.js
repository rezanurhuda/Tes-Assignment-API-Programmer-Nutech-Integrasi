const express = require('express');
const Service = require('../models/Service'); // Import model Service
const router = express.Router();

// Endpoint Service
router.get('/', async (req, res) => {
    try {
        const services = await Service.find(); // Ambil semua data service dari database

        if (services.length === 0) {
            return res.status(404).json({
                status: 104,
                message: "Tidak ada service ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: services
        });
    } catch (error) {
        console.error('Error retrieving services:', error);
        return res.status(500).json({
            status: 1,
            message: "Internal Server Error",
            data: null
        });
    }
});

module.exports = router;