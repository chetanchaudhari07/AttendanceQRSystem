const express = require('express');
const Attendance = require("../controllers/reportController");

const router = express.Router();

router.get("/report", Attendance.exportAttendance);

module.exports = router;