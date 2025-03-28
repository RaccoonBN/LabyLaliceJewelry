const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import connection pool MySQL
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 Đăng ký tài khoản
router.post("/register", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Lấy kết nối từ pool
        const connection = await pool.getConnection();

        try {
            // Kiểm tra xem email đã tồn tại chưa
            const [result] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
            if (result.length > 0) return res.status(400).json({ error: "Email đã tồn tại!" });

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Chèn người dùng vào DB
            const sql = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
            await connection.query(sql, [fullname, email, hashedPassword]);

            res.status(201).json({ message: "Đăng ký thành công!" });
        } finally {
            connection.release(); // Trả kết nối về pool
        }
    } catch (err) {
        console.error("Lỗi register:", err);
        return res.status(500).json({ error: err.message });
    }
});

// 🔹 Đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu!" });
        }

        // Lấy kết nối từ pool
        const connection = await pool.getConnection();

        try {
            // Tìm người dùng theo email
            const [result] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);

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
        } finally {
            connection.release(); // Trả kết nối về pool
        }
    } catch (error) {
        console.error("Lỗi login:", error);
        res.status(500).json({ error: "Lỗi server! Vui lòng thử lại sau." });
    }
});

// 🔹 Lấy thông tin người dùng từ token
router.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization;

        // Kiểm tra xem token có tồn tại trong header hay không
        if (!token) return res.status(401).json({ error: "Không có token!" });

        // Tách "Bearer " khỏi token
        const tokenString = token.split(' ')[1]; // Lấy phần token sau "Bearer"

        jwt.verify(tokenString, process.env.JWT_SECRET || "SECRET_KEY", async (err, decoded) => {
            if (err) return res.status(403).json({ error: "Token không hợp lệ!" });

            // Lấy kết nối từ pool
            const connection = await pool.getConnection();
            try {
                // Truy vấn dữ liệu người dùng từ database
                const [result] = await connection.query("SELECT id, fullname, email, created_at FROM users WHERE id = ?", [decoded.id]);

                if (result.length === 0) {
                    return res.status(404).json({ error: "Không tìm thấy người dùng!" });
                }

                res.json(result[0]);
            } finally {
                connection.release(); // Trả kết nối về pool
            }
        });
    } catch (error) {
        console.error("Lỗi profile:", error);
        res.status(500).json({ error: "Lỗi server! Vui lòng thử lại sau." });
    }
});

// 🔹 Cập nhật tài khoản người dùng
router.put("/edit-account", async (req, res) => {
    try {
        const { id, fullname, email, newPassword } = req.body;

        if (!id) return res.status(400).json({ error: "Thiếu ID người dùng!" });

        // Lấy kết nối từ pool
        const connection = await pool.getConnection();

        try {
            // Kiểm tra xem email có trùng với người dùng khác không
            const [result] = await connection.query("SELECT * FROM users WHERE email = ? AND id != ?", [email, id]);
            if (result.length > 0) return res.status(400).json({ error: "Email đã được sử dụng!" });

            let updateQuery = "UPDATE users SET fullname = ?, email = ? WHERE id = ?";
            let params = [fullname, email, id];

            // Nếu có mật khẩu mới, hash lại trước khi cập nhật
            if (newPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                updateQuery = "UPDATE users SET fullname = ?, email = ?, password = ? WHERE id = ?";
                params = [fullname, email, hashedPassword, id];
            }

            await connection.query(updateQuery, params);

            res.json({ message: "Cập nhật tài khoản thành công!" });
        } finally {
            connection.release(); // Trả kết nối về pool
        }
    } catch (error) {
        console.error("Lỗi edit-account:", error);
        res.status(500).json({ error: "Lỗi server! Vui lòng thử lại sau." });
    }
});

module.exports = router;