const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

exports.markAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { latitude, longitude } = req.body;

        if (!employeeId || !latitude || !longitude) {
            return res.status(400).json({ message: "Employee ID and location are required" });
        }

        const employee = await Employee.findById(employeeId).lean();
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const { password, ...employeeWithoutPassword } = employee;

        const location = `Lat: ${latitude}, Lon: ${longitude}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            employeeId,
            timestamp: { $gte: today },
        });

        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance already marked today" });
        }

        const attendance = new Attendance({
            employeeId,
            location,
            status: "present",
            employeeDetails: employeeWithoutPassword,
        });

        await attendance.save();

        res.json({ message: "Attendance marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};