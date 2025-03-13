const express = require("express");
const router = express.Router();
const db = require("../db"); // Import kết nối MySQL
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 Đăng ký tài khoản
router.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) return res.status(400).json({ error: "Email đã tồn tại!" });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Chèn người dùng vào DB
        const sql = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
        db.query(sql, [fullname, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Đăng ký thành công!" });
        });
    });
});

// 🔹 Đăng nhập
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(400).json({ error: "Email hoặc mật khẩu không đúng!" });

        const user = result[0];

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Email hoặc mật khẩu không đúng!" });

        // Tạo token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });

        res.json({ message: "Đăng nhập thành công!", token, user });
    });
});

// 🔹 Lấy thông tin người dùng từ token
router.get("/profile", (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Không có token!" });

    jwt.verify(token, "SECRET_KEY", (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token không hợp lệ!" });

        db.query("SELECT id, fullname, email, created_at FROM users WHERE id = ?", [decoded.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result[0]);
        });
    });
});

module.exports = router;
