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
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu!" });
        }

        // Tìm người dùng theo email
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
            if (err) {
                console.error("Lỗi truy vấn DB:", err);
                return res.status(500).json({ error: "Lỗi server! Vui lòng thử lại sau." });
            }

            if (result.length === 0) {
                return res.status(400).json({ error: "Email hoặc mật khẩu không đúng!" });
            }

            const user = result[0];

            // Kiểm tra mật khẩu (phải dùng await vì bcrypt.compare() là async)
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Email hoặc mật khẩu không đúng!" });
            }

            // Tạo token JWT (nên lưu SECRET_KEY trong biến môi trường)
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "SECRET_KEY", {
                expiresIn: "1h",
            });

            res.json({ message: "Đăng nhập thành công!", token, user });
        });

    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ error: "Lỗi server! Vui lòng thử lại sau." });
    }
});


// 🔹 Lấy thông tin người dùng từ token
router.get("/profile", (req, res) => {
    const token = req.headers.authorization;

    // Kiểm tra xem token có tồn tại trong header hay không
    if (!token) return res.status(401).json({ error: "Không có token!" });

    // Tách "Bearer " khỏi token
    const tokenString = token.split(' ')[1]; // Lấy phần token sau "Bearer"

    jwt.verify(tokenString, "SECRET_KEY", (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token không hợp lệ!" });

        // Truy vấn dữ liệu người dùng từ database
        db.query("SELECT id, fullname, email, created_at FROM users WHERE id = ?", [decoded.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result[0]);
        });
    });
});

// 🔹 Cập nhật tài khoản người dùng
router.put("/edit-account", async (req, res) => {
    const { id, fullname, email, newPassword } = req.body;

    if (!id) return res.status(400).json({ error: "Thiếu ID người dùng!" });

    // Kiểm tra xem email có trùng với người dùng khác không
    db.query("SELECT * FROM users WHERE email = ? AND id != ?", [email, id], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) return res.status(400).json({ error: "Email đã được sử dụng!" });

        let updateQuery = "UPDATE users SET fullname = ?, email = ? WHERE id = ?";
        let params = [fullname, email, id];

        // Nếu có mật khẩu mới, hash lại trước khi cập nhật
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateQuery = "UPDATE users SET fullname = ?, email = ?, password = ? WHERE id = ?";
            params = [fullname, email, hashedPassword, id];
        }

        db.query(updateQuery, params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Cập nhật tài khoản thành công!" });
        });
    });
});

module.exports = router;
