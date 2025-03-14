const express = require('express');
const router = express.Router();
const db = require('../db'); 

// Lấy giỏ hàng của user
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query(`SELECT ci.id, p.name, col.name AS collection_name, p.price, ci.quantity, p.image 
              FROM carts c 
              JOIN cart_items ci ON c.id = ci.cart_id 
              JOIN products p ON ci.product_id = p.id 
              LEFT JOIN collections col ON p.collection_id = col.id
              WHERE c.user_id = ?`, [userId], 
    (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Lấy tổng số lượng sản phẩm trong giỏ hàng
router.get('/count/:userId', (req, res) => {
    const userId = req.params.userId;

    db.query(`SELECT SUM(ci.quantity) AS total_count 
              FROM carts c 
              JOIN cart_items ci ON c.id = ci.cart_id 
              WHERE c.user_id = ?`, [userId], 
    (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ total_count: result[0].total_count || 0 });
    });
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    // Kiểm tra xem user đã có giỏ hàng chưa
    db.query('SELECT id FROM carts WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        let cartId;
        
        if (results.length > 0) {
            cartId = results[0].id;
            addToCart(cartId);
        } else {
            db.query('INSERT INTO carts (user_id) VALUES (?)', [userId], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                cartId = result.insertId;
                addToCart(cartId);
            });
        }
    });
    
    function addToCart(cartId) {
        db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                const newQuantity = results[0].quantity + quantity;
                db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, results[0].id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "Sản phẩm đã được cập nhật trong giỏ hàng" });
                });
            } else {
                db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
                });
            }
        });
    }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.post('/updateQuantity', (req, res) => {
    const { cartItemId, quantity } = req.body;
    db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cartItemId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cập nhật số lượng thành công" });
    });
});

// Xóa sản phẩm khỏi giỏ hàng
router.post('/removeItem', (req, res) => {
    const { cartItemId } = req.body;
    db.query('DELETE FROM cart_items WHERE id = ?', [cartItemId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Xóa sản phẩm thành công" });
    });
});

// Xóa toàn bộ giỏ hàng của user
router.post('/clear/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query('DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)', [userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Giỏ hàng đã được làm trống" });
    });
});

module.exports = router;
