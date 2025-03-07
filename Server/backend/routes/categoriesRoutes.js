const express = require("express");
const router = express.Router();
const db = require("../db");

// Lấy danh sách danh mục
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Thêm danh mục mới
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Tên danh mục không được để trống" });

  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, name });
  });
});

// Cập nhật danh mục
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Tên danh mục không được để trống" });

  db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Cập nhật thành công" });
  });
});

// Xóa danh mục
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Xóa thành công" });
  });
});

module.exports = router;
