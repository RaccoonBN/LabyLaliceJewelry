const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📌 1️⃣ API lấy danh sách tất cả đơn hàng (Admin)
router.get("/all", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // Thay đổi thứ tự sắp xếp
        const queryOrders = `
      SELECT
        o.id AS order_id,
        o.fullname AS customer_name,
        o.phone AS customer_phone,
        o.address AS customer_address,
        o.total AS total_price,
        o.payment_method,
        o.payment_status,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC; -- Sắp xếp theo thời gian tạo đơn hàng giảm dần (mới nhất trước)
    `;

        const [orders] = await connection.execute(queryOrders);

        // Lặp qua từng đơn hàng để lấy danh sách sản phẩm
        const orderPromises = orders.map(async (order) => {
            const queryOrderItems = `
        SELECT
          p.id,
          p.name,
          oi.quantity,
          p.price
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?;
      `;

            const [products] = await connection.execute(queryOrderItems, [
                order.order_id,
            ]);
            order.products = products; // Thêm danh sách sản phẩm vào đơn hàng
            return order;
        });

        const ordersWithProducts = await Promise.all(orderPromises);
        res.json(ordersWithProducts);
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
        return res.status(500).json({ error: "Lỗi server" });
    } finally {
        if (connection) connection.release();
    }
});

// 📌 2️⃣ API xem chi tiết đơn hàng (Admin)
router.get("/:orderId", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { orderId } = req.params;

        // Lấy thông tin đơn hàng
        const [order] = await connection.execute(
            "SELECT * FROM orders WHERE id = ?",
            [orderId]
        );

        if (order.length === 0) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại" });
        }

        // Lấy danh sách sản phẩm trong đơn hàng
        const [orderItems] = await connection.execute(
            `
      SELECT oi.*, p.name, p.image 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `,
            [orderId]
        );

        res.json({ order: order[0], items: orderItems });
    } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
        return res.status(500).json({ error: "Lỗi server" });
    } finally {
        if (connection) connection.release();
    }
});

// 📌 3️⃣ API cập nhật trạng thái đơn hàng (Admin)
router.put("/:orderId/status", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { orderId } = req.params;
        const { status } = req.body;

        const [result] = await connection.execute(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại" });
        }

        res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
        return res.status(500).json({ error: "Lỗi server" });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;