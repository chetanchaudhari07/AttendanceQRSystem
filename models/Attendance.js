const mongoose = require("mongoose");
const EmployeeSchema = require("./Employee").schema;

const AttendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    timestamp: { type: Date, default: Date.now },
    location: String,
    status: { type: String, enum: ["present", "absent"], default: "absent" },
    employeeDetails: EmployeeSchema,
});

module.exports = mongoose.model("Attendance", AttendanceSchema);    