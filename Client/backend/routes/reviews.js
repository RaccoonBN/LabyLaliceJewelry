const express = require("express");
const router = express.Router();
const db = require("../db"); // Đảm bảo bạn đã import kết nối database

// 📌 API lấy danh sách đánh giá theo productId
router.get("/:productId", (req, res) => {
  const productId = req.params.productId;

  const reviewQuery = `
    SELECT r.id, r.user_id, r.product_id, r.rating, r.comment, r.created_at, 
           u.fullname AS username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC;
  `;

  db.query(reviewQuery, [productId], (err, reviews) => {
    if (err) {
      console.error("Lỗi truy vấn đánh giá sản phẩm:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ reviews });
  });
});

// 📌 API thêm đánh giá mới
router.post("/", (req, res) => {
  const { user_id, product_id, rating, comment } = req.body;

  if (!user_id || !product_id || !rating || !comment) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  const insertQuery = `
    INSERT INTO reviews (user_id, product_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, NOW());
  `;

  db.query(insertQuery, [user_id, product_id, rating, comment], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm đánh giá:", err);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: "Đánh giá đã được thêm!", reviewId: result.insertId });
  });
});

module.exports = router;
