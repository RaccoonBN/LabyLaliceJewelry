const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import connection pool MySQL

// API lấy danh sách categories
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Lấy kết nối từ pool
    const [results] = await connection.execute("SELECT * FROM categories");
    res.json(results);
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      connection.release(); // Trả kết nối về pool
    }
  }
});

module.exports = router;