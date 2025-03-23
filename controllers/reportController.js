const XLSX = require('xlsx');
const fs = require('fs');
const path = require("path");
const Attendance = require("../models/Attendance");

exports.exportAttendance = async (req, res) => {
    try {
        const attendanceData = await Attendance.find().populate("employeeId", "-password");

        const data = attendanceData.map(record => ({
            Name: record.employeeId?.name || "Unknown",
            Email: record.employeeId?.email || "N/A",
            Contact: record.employeeId?.contact || "N/A",
            BankName: record.employeeId?.BankName || "N/A",
            SOLId: record.employeeId?.SOLId || "N/A",
            BranchBMName: record.employeeId?.BranchBMName || "N/A",
            BranchBMContact: record.employeeId?.BranchBMContact || "N/A",
            BranchHeadName: record.employeeId?.BranchHeadName || "N/A",
            BranchHeadContact: record.employeeId?.BranchHeadContact || "N/A",
            SuperVisorName: record.employeeId?.SuperVisorName || "N/A",
            SuperVisorContact: record.employeeId?.SuperVisorContact || "N/A",
            City: record.employeeId?.City || "N/A",
            Role: record.employeeId?.role || "N/A",
            AttendanceTimestamp: record.timestamp,
            Location: record.location,
            Status: record.status,
          }));

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workBook, workSheet, "Attendance");

        const filePath = path.join(__dirname, "../public/attendance.xlsx");
        XLSX.writeFile(workBook, filePath);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=attendance.xlsx");

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Failed to download file." });
            } else {
                setTimeout(() => fs.unlinkSync(filePath), 60000);
            }
        });

    } catch (error) {
        console.error("Error exporting attendance:", error);
        res.status(500).json({ message: "Failed to export attendance." });
    }
}