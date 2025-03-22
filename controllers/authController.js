const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            contact,
            BankName,
            SOLId,
            BranchBMName,
            BranchBMContact,
            BranchHeadName,
            BranchHeadContact,
            SuperVisorName,
            SuperVisorContact,
            City,
            role
        } = req.body;

        if (!name || !email || !password || !contact) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
            contact,
            BankName,
            SOLId,
            BranchBMName,
            BranchBMContact,
            BranchHeadName,
            BranchHeadContact,
            SuperVisorName,
            SuperVisorContact,
            City,
            role
        });

        await newEmployee.save();

        const token = jwt.sign(
            { id: newEmployee._id, role: newEmployee.role },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Employee registered successfully",
            employee: {
                _id: newEmployee._id,
                name: newEmployee.name,
                email: newEmployee.email,
                contact: newEmployee.contact,
                role: newEmployee.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {

    const { email, role, password } = req.body;
    try {

        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }



        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid password" });
        }
        if (employee.role !== role) {
            console.log("Role mismatch");

            return res.status(403).json({ message: "Forbidden" });
        }
        const token = jwt.sign({ id: employee._id, email, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Employee login", token, employeeId: employee._id });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



