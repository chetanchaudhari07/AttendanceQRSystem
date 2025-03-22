const express = require('express');
const mongoose = require('mongoose');
const crossOrigin = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(crossOrigin());



app.get("/", (req, res) => {
    res.send("hello");
});

const PORT = 8000;

const mongooseConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.log('MongoDB connection error:', error);
        setTimeout(() => mongooseConnect(), 5000);
    }
}

mongooseConnect();

app.use("/auth", require("./routes/authRoutes"));
app.use("/attendance", require("./routes/attendanceRoutes"));
app.use("/qr", require("./routes/qrRoutes"));
app.use("/excel", require("./routes/attendanceData"));


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

