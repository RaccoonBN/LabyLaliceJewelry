const express = require("express");
const router = express.Router();
const db = require("../db"); // Cấu hình kết nối MySQL

// 📌 1️⃣ API lấy danh sách tất cả đơn hàng (Admin)
router.get("/all", (req, res) => {
    const query = `
        SELECT 
            o.id AS order_id,
            o.fullname AS customer_name,
            o.phone AS customer_phone,
            o.address AS customer_address,
            COUNT(oi.id) AS total_products,
            o.total AS total_price,
            o.payment_method,
            o.payment_status,
            o.status,
            o.created_at
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.payment_status ASC, o.created_at DESC;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
            return res.status(500).json({ error: "Lỗi server" });
        }
        res.json(results);
    });
});



// 📌 2️⃣ API xem chi tiết đơn hàng (Admin)
router.get("/:orderId", (req, res) => {
    const { orderId } = req.params;

    // Lấy thông tin đơn hàng
    db.query("SELECT * FROM orders WHERE id = ?", [orderId], (error, order) => {
        if (error) {
            console.error("Lỗi lấy chi tiết đơn hàng:", error);
            return res.status(500).json({ error: "Lỗi server" });
        }

        if (order.length === 0) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại" });
        }

        // Lấy danh sách sản phẩm trong đơn hàng
        db.query(`
            SELECT oi.*, p.name, p.image 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?`, 
            [orderId], 
            (error, orderItems) => {
                if (error) {
                    console.error("Lỗi lấy danh sách sản phẩm:", error);
                    return res.status(500).json({ error: "Lỗi server" });
                }

                res.json({ order: order[0], items: orderItems });
            }
        );
    });
});

// 📌 3️⃣ API cập nhật trạng thái đơn hàng (Admin)
router.put("/:orderId/status", (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId], (error, result) => {
        if (error) {
            console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
            return res.status(500).json({ error: "Lỗi server" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại" });
        }

        res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    });
});

module.exports = router;
