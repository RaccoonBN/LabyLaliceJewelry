const express = require('express');
const router = express.Router();
const pool = require('../db');

// Lấy giỏ hàng của user
router.get('/:userId', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const userId = req.params.userId;
        const [result] = await connection.execute(`
            SELECT ci.id, p.name, p.price, ci.quantity, p.image, p.id as product_id
            FROM carts c 
            JOIN cart_items ci ON c.id = ci.cart_id 
            JOIN products p ON ci.product_id = p.id 
            WHERE c.user_id = ?`, [userId]);
        res.json(result);
    } catch (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Lấy tổng số lượng sản phẩm trong giỏ hàng
router.get('/count/:userId', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const userId = req.params.userId;

        const [result] = await connection.execute(`
            SELECT SUM(ci.quantity) AS total_count 
            FROM carts c 
            JOIN cart_items ci ON c.id = ci.cart_id 
            WHERE c.user_id = ?`, [userId]);
        res.json({ total_count: result[0].total_count || 0 });
    } catch (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: "Thiếu thông tin: userId, productId, quantity" });
        }

        await connection.beginTransaction();  // Bắt đầu transaction

        try {
            // Kiểm tra xem user đã có giỏ hàng chưa
            const [results] = await connection.execute('SELECT id FROM carts WHERE user_id = ?', [userId]);
            let cartId;

            if (results.length > 0) {
                cartId = results[0].id;
            } else {
                const [result] = await connection.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
                cartId = result.insertId;
            }

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const [cartItems] = await connection.execute('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

            if (cartItems.length > 0) {
                const newQuantity = cartItems[0].quantity + quantity;
                await connection.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, cartItems[0].id]);
                res.json({ message: "Sản phẩm đã được cập nhật trong giỏ hàng" });
            } else {
                await connection.execute('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
                res.json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
            }

            await connection.commit();  // Commit transaction
        } catch (innerErr) {
            await connection.rollback();  // Rollback nếu có lỗi
            throw innerErr; // Re-throw lỗi để catch ở ngoài
        }
    } catch (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

router.put('/updateQuantity', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction(); // Bắt đầu transaction
        const { cartItemId, quantity } = req.body;

        if (!cartItemId || !quantity || quantity < 1) {
            return res.status(400).json({ error: "Dữ liệu không hợp lệ!" });
        }

        try {
            // Lấy thông tin sản phẩm từ giỏ hàng
            const [cartResult] = await connection.execute(
                'SELECT product_id, quantity FROM cart_items WHERE id = ?',
                [cartItemId]
            );

            if (cartResult.length === 0) {
                return res.status(404).json({ error: "Sản phẩm không tồn tại trong giỏ hàng!" });
            }

            const { product_id, quantity: oldQuantity } = cartResult[0];

            // Kiểm tra số lượng tồn kho
            const [productResult] = await connection.execute(
                'SELECT stock FROM products WHERE id = ?',
                [product_id]
            );

            if (productResult.length === 0) {
                return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
            }

            const stock = productResult[0].stock;
            const stockDifference =  oldQuantity - quantity; // quantity mới - số lượng cũ

            if (quantity > oldQuantity && stock < (quantity - oldQuantity) ) {
                return res.status(400).json({ error: "Không đủ hàng trong kho!" });
            }

            // Cập nhật số lượng trong giỏ hàng
            const [updateCartResult] = await connection.execute(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [quantity, cartItemId]
            );

            if (updateCartResult.affectedRows === 0) {
                return res.status(400).json({ error: "Không có thay đổi nào!" });
            }

            // Cập nhật tồn kho trong bảng products
            await connection.execute(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [stockDifference, product_id]
            );

            await connection.commit(); // Commit transaction
            res.json({ message: "Cập nhật số lượng thành công!" });
        } catch (innerErr) {
            await connection.rollback(); // Rollback transaction
            throw innerErr;
        }
    } catch (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});


// Xóa sản phẩm khỏi giỏ hàng
router.post('/removeItem', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { cartItemId } = req.body;

        if (!cartItemId) {
            return res.status(400).json({ error: "Thiếu cartItemId!" });
        }
        await connection.execute('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
        res.json({ message: "Xóa sản phẩm thành công" });
    } catch (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;