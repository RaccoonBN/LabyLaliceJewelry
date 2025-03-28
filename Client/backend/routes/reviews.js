const express = require("express");
const router = express.Router();
const pool = require("../db"); // Đảm bảo bạn đã import connection pool

// 📌 API lấy danh sách đánh giá theo productId
router.get("/:productId", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const productId = req.params.productId;

        const reviewQuery = `
            SELECT r.id, r.user_id, r.product_id, r.rating, r.comment, r.created_at, 
                   u.fullname AS username
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC;
        `;

        const [reviews] = await connection.execute(reviewQuery, [productId]);

        res.json({ reviews });
    } catch (err) {
        console.error("Lỗi truy vấn đánh giá sản phẩm:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 📌 API thêm đánh giá mới
router.post("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { user_id, product_id, rating, comment } = req.body;

        if (!user_id || !product_id || !rating || !comment) {
            return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
        }

        const insertQuery = `
            INSERT INTO reviews (user_id, product_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, NOW());
        `;

        const [result] = await connection.execute(insertQuery, [user_id, product_id, rating, comment]);

        res.status(201).json({ message: "Đánh giá đã được thêm!", reviewId: result.insertId });
    } catch (err) {
        console.error("Lỗi khi thêm đánh giá:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;