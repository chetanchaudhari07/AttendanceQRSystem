const express = require('express');
const { generateQR } = require('../controllers/qrController');

const router = express.Router();

router.get("/generate-qr/:employeeId", generateQR);

module.exports = router;