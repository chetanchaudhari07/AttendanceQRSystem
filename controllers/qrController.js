const QRCode = require("qrcode");

exports.generateQR = async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) {
            return res.status(400).json({ message: "Employee ID is required" });
        }


        const qrUrl = `http://localhost:5174/scan-qr/${employeeId}`;

        const qrCodeDataURL = await QRCode.toDataURL(qrUrl);

        res.json({ qrCode: qrCodeDataURL });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
