const express = require("express");
const db = require("../db");

const router = express.Router();

// Lấy danh sách người dùng
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    } else {
      res.json(result);
    }
  });
});

// Cập nhật người dùng
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { fullname, email, password } = req.body;
  db.query(
    "UPDATE users SET fullname = ?, email = ?, password = ? WHERE id = ?",
    [fullname, email, password, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Lỗi khi cập nhật người dùng" });
      } else {
        res.json({ message: "Cập nhật thành công" });
      }
    }
  );
});

// Xóa người dùng
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Lỗi khi xóa người dùng" });
    } else {
      res.json({ message: "Xóa thành công" });
    }
  });
});

module.exports = router;
