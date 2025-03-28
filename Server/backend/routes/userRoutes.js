const express = require("express");
const router = express.Router();
const pool = require("../db");

// Lấy danh sách người dùng
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute("SELECT * FROM users");
    res.json(result);
  } catch (err) {
    console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
    res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Cập nhật người dùng
router.put("/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { id } = req.params;
    const { fullname, email, password } = req.body;
    await connection.execute(
      "UPDATE users SET fullname = ?, email = ?, password = ? WHERE id = ?",
      [fullname, email, password, id]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi khi cập nhật người dùng:", err);
    res.status(500).json({ error: "Lỗi khi cập nhật người dùng" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Xóa người dùng
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { id } = req.params;
    await connection.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa người dùng:", err);
    res.status(500).json({ error: "Lỗi khi xóa người dùng" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;