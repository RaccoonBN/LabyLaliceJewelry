const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import connection pool

// API lấy danh sách bộ sưu tập
router.get("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection(); // Lấy kết nối từ pool
        const [results] = await connection.execute("SELECT * FROM collections");
        res.json(results);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách bộ sưu tập:", err);
        return res.status(500).json({ error: "Lỗi khi lấy danh sách bộ sưu tập" });
    } finally {
        if (connection) {
            connection.release(); // Trả kết nối về pool
        }
    }
});

module.exports = router;