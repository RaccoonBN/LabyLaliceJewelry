const express = require("express");
const router = express.Router();
const db = require("../db");

// Lấy danh sách bộ sưu tập cùng số lượng sản phẩm
router.get("/", (req, res) => {
    const sql = `
      SELECT c.id, c.name, c.description, 
             (SELECT COUNT(*) FROM products p WHERE p.collection_id = c.id) AS product_count
      FROM collections c
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
      }
      res.json(results);
    });
  });

// Thêm bộ sưu tập mới
router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Tên bộ sưu tập không được để trống" });

  db.query(
    "INSERT INTO collections (name, description) VALUES (?, ?)",
    [name, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, name, description });
    }
  );
});

// Cập nhật bộ sưu tập
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Tên bộ sưu tập không được để trống" });

  db.query(
    "UPDATE collections SET name = ?, description = ? WHERE id = ?",
    [name, description, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Cập nhật thành công" });
    }
  );
});

// Xóa bộ sưu tập
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM collections WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Xóa thành công" });
  });
});



module.exports = router;
