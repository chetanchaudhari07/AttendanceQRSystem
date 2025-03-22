const express = require('express');
const { markAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.post('/markAttendance/:employeeId', markAttendance);

module.exports = router;    