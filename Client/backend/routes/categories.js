const express = require("express");
const router = express.Router();
const db = require("../db"); // Nếu bạn kết nối DB

// API lấy danh sách categories
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
