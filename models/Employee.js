const mongoose = require("mongoose");


const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: Number,
    BankName: String,
    SOLId: Number,
    BranchBMName: String,
    BranchBMContact: Number,
    BranchHeadName: String,
    BranchHeadContact: Number,
    SuperVisorName: String,
    SuperVisorContact: Number,
    City: String,
    role: { type: String, enum: ["user", "manager", "supervisor"], default: "user" },
    qrCode: String,
});



module.exports = mongoose.model("Employee", EmployeeSchema);

