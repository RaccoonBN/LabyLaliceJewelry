const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(`
      SELECT categories.*, COUNT(products.id) AS product_count
      FROM categories
      LEFT JOIN products ON categories.id = products.category_id
      GROUP BY categories.id
    `);
    res.json(results);
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Thêm danh mục mới
router.post("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Tên danh mục không được để trống" });

    const [result] = await connection.execute("INSERT INTO categories (name) VALUES (?)", [name]);
    res.json({ id: result.insertId, name });
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Cập nhật danh mục
router.put("/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Tên danh mục không được để trống" });

    await connection.execute("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Xóa danh mục
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { id } = req.params;
    await connection.execute("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;