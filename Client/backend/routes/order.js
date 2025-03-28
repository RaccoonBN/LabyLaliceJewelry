const express = require('express');
const pool = require('../db');  // Đảm bảo rằng bạn đã cấu hình pool trong file này
const router = express.Router();

// Route để lấy danh sách tất cả các đơn hàng
router.get('/all/:userId', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId' });
        }

        const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
        const [result] = await connection.execute(query, [userId]);
        res.status(200).json(result);
    } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        return res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error: err });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


router.post("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();  // Start transaction

        const { userId, items, totalAmount, name, address, phone, paymentMethod } = req.body;

        if (!userId || !items || !totalAmount || !name || !address || !phone || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const orderStatus = "Đã Tiếp Nhận";
        let paymentStatus = paymentMethod === "cod" ? "Chưa Thanh Toán" : "Đã Thanh Toán";

        const orderQuery = `INSERT INTO orders (user_id, fullname, phone, address, total, payment_method, payment_status, status, created_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        const [result] = await connection.execute(orderQuery, [userId, name, phone, address, totalAmount, paymentMethod, paymentStatus, orderStatus]);
        const orderId = result.insertId;

        if (!orderId) {
            return res.status(500).json({ message: "Failed to retrieve order ID after inserting order" });
        }

        const productIds = items.map(item => item.id);
        const checkProductQuery = `SELECT id, price, stock FROM products WHERE id IN (?)`;
        const [products] = await connection.execute(checkProductQuery, [productIds]);

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No valid products found", productIds });
        }

        const validProductIds = products.map(product => product.id);
        const invalidItems = items.filter(item => !validProductIds.includes(item.id));

        if (invalidItems.length > 0) {
            return res.status(400).json({ message: "Some products are not valid", invalidItems });
        }

        // Tính toán giá trị từng sản phẩm và kiểm tra tồn kho
        const orderItemsValues = [];
        const stockUpdates = [];

        for (let item of items) {
            const product = products.find(p => p.id === item.id);
            if (!product) continue;

            if (product.stock < item.quantity) {
                await connection.rollback(); // Rollback if not enough stock
                return res.status(400).json({
                    message: `Not enough stock for product ${item.id}`,
                    productId: item.id,
                    availableStock: product.stock,
                });
            }

            const price = parseFloat(product.price);
            const totalPrice = price * item.quantity;
            orderItemsValues.push([orderId, item.id, item.quantity, totalPrice]);

            // Chuẩn bị câu lệnh cập nhật tồn kho
            stockUpdates.push({
                id: item.id,
                newStock: product.stock - item.quantity,
            });
        }

        if (orderItemsValues.length === 0) {
            return res.status(400).json({ message: "No valid items to insert" });
        }

        const orderItemsQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`;
        await connection.execute(orderItemsQuery, [orderItemsValues]);


        // **Cập nhật tồn kho của sản phẩm**
        for (let item of stockUpdates) {
            await connection.execute(`UPDATE products SET stock = ? WHERE id = ?`, [item.newStock, item.id]);
        }

        await connection.commit(); // Commit the transaction

        res.status(201).json({
            message: "Order created successfully",
            orderId: orderId,
            items: items,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            status: orderStatus,
        });
    } catch (err) {
        if (connection) await connection.rollback(); // Rollback in case of any error
        console.error("Lỗi khi tạo đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


router.get('/:orderId', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { orderId } = req.params;

        // Truy vấn thông tin đơn hàng từ bảng orders
        const orderQuery = `
            SELECT id, user_id, fullname, email, phone, address, total, status, payment_method, payment_status, created_at 
            FROM orders 
            WHERE id = ?
        `;

        const [result] = await connection.execute(orderQuery, [orderId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const order = result[0];

        // Truy vấn thông tin sản phẩm trong đơn hàng, kết hợp với bảng products
        const orderItemsQuery = `
            SELECT oi.id, oi.quantity, oi.price, 
                   p.id AS product_id, p.name AS product_name, p.description, 
                   p.image AS product_image, p.stock, p.category_id, p.collection_id
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;

        const [items] = await connection.execute(orderItemsQuery, [orderId]);


        res.status(200).json({
            orderId: order.id,
            userId: order.user_id,
            fullname: order.fullname,
            email: order.email,
            phone: order.phone,
            address: order.address,
            totalAmount: order.total,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,  // Thêm trạng thái thanh toán
            status: order.status,
            createdAt: order.created_at,
            items: items.map((item) => ({
                id: item.id,
                productId: item.product_id,
                name: item.product_name,
                description: item.description,
                image: item.product_image,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price,
                stock: item.stock,  // Thêm thông tin tồn kho
                categoryId: item.category_id,
                collectionId: item.collection_id,
            })),
        });
    } catch (err) {
        console.error("Lỗi khi lấy thông tin chi tiết đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi khi lấy thông tin chi tiết đơn hàng", error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


module.exports = router;