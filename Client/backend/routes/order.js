const express = require('express');
const pool = require('../db');
const router = express.Router();
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Định nghĩa helper formatCurrency
handlebars.registerHelper('formatCurrency', function(value) {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
    return formattedValue;
});

// Đọc file template email
const emailTemplateSource = fs.readFileSync(path.join(__dirname, './email_template.hbs'), 'utf8');
const compiledEmailTemplate = handlebars.compile(emailTemplateSource);

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'labylalicejewelry@gmail.com',
        pass: 'lfzl jbuh zbzc drnh' // Thay bằng mật khẩu ứng dụng của bạn
    }
});

// Hàm gửi email xác nhận đơn hàng (đã được tách ra)
const sendConfirmationEmail = async (orderId, email) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // Lấy thông tin đơn hàng
        const orderQuery = `
            SELECT id, user_id, fullname, phone, address, total, status, payment_method, payment_status, created_at, email
            FROM orders
            WHERE id = ?
        `;

        const [orderResult] = await connection.execute(orderQuery, [orderId]);

        if (orderResult.length === 0) {
            throw new Error('Không tìm thấy đơn hàng để gửi email.');
        }

        const order = orderResult[0];

        // Lấy thông tin sản phẩm trong đơn hàng
        const orderItemsQuery = `
            SELECT oi.id, oi.quantity,
                   p.id AS product_id, p.name AS product_name, p.description,
                   p.image AS product_image, p.price, p.stock, p.category_id, p.collection_id
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;

        const [items] = await connection.execute(orderItemsQuery, [orderId]);

        // Tạo nội dung email từ template
        const emailBody = compiledEmailTemplate({
            items: items.map((item) => ({
                ...item,
                total: item.quantity * item.price,
            })),
            totalAmount: order.total,
            address: order.address,
            phone: order.phone,
            paymentMethod: order.payment_method,
            orderStatus: order.status
        });

        // Cấu hình nội dung email
        const mailOptions = {
            from: 'labylalicejewelry@gmail.com', // Địa chỉ email của bạn
            to: email, // Địa chỉ email của người nhận
            subject: 'Xác nhận đơn hàng', // Tiêu đề email
            html: emailBody // Nội dung email (có thể dùng HTML)
        };

        // Gửi email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Lỗi khi gửi email:", error);
            } else {
                console.log('Email đã được gửi thành công: ' + info.response);
            }
        });

    } catch (error) {
        console.error("Lỗi khi gửi email xác nhận:", error);
    } finally {
        if (connection) connection.release();
    }
};

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

router.get('/:orderId', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { orderId } = req.params;

        // Truy vấn thông tin đơn hàng từ bảng orders
        const orderQuery = `
            SELECT id, user_id, fullname, phone, address, total, status, payment_method, payment_status, created_at, email
            FROM orders
            WHERE id = ?
        `;

        const [result] = await connection.execute(orderQuery, [orderId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        const order = result[0];

        // Truy vấn thông tin sản phẩm trong đơn hàng, lấy giá từ bảng products
        const orderItemsQuery = `
            SELECT oi.id, oi.quantity,
                   p.id AS product_id, p.name AS product_name, p.description,
                   p.image AS product_image, p.price, p.stock, p.category_id, p.collection_id
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;

        const [items] = await connection.execute(orderItemsQuery, [orderId]);

        res.status(200).json({
            orderId: order.id,
            userId: order.user_id,
            fullname: order.fullname,
            phone: order.phone,
            address: order.address,
            totalAmount: order.total,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            status: order.status,
            createdAt: order.created_at,
            email: order.email,
            items: items.map((item) => ({
                id: item.product_id,
                productId: item.product_id,
                name: item.product_name,
                description: item.description,
                image: item.product_image,
                quantity: item.quantity,
                price: item.price, // Lấy price từ bảng products
                total: item.quantity * item.price, // Tính lại total
                stock: item.stock,
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



router.post("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction(); // Bắt đầu transaction

        const { userId, items, totalAmount, name, address, phone, paymentMethod, email } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !items || !totalAmount || !name || !address || !phone || !paymentMethod || !email) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        const orderStatus = "Đã Tiếp Nhận";
        let paymentStatus = paymentMethod === "cod" ? "Chưa Thanh Toán" : "Đã Thanh Toán";

        // Tạo đơn hàng
        const orderQuery = `
            INSERT INTO orders (user_id, fullname, phone, address, total, payment_method, payment_status, status, created_at, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;
        const [result] = await connection.execute(orderQuery, [userId, name, phone, address, totalAmount, paymentMethod, paymentStatus, orderStatus, email]);

        const orderId = result.insertId;
        if (!orderId) {
            throw new Error("Không thể lấy ID đơn hàng sau khi tạo");
        }

        // Lấy danh sách ID sản phẩm
        const productIds = items.map(item => item.id);
        if (productIds.length === 0) {
            throw new Error("Không có sản phẩm hợp lệ");
        }

        // Kiểm tra sản phẩm có tồn tại và tồn kho
        const placeholders = productIds.map(() => "?").join(",");
        const checkProductQuery = `SELECT id, price, stock FROM products WHERE id IN (${placeholders})`;
        const [products] = await connection.execute(checkProductQuery, productIds);

        if (!products || products.length === 0) {
            throw new Error("Không tìm thấy sản phẩm hợp lệ");
        }

        const validProductIds = products.map(p => p.id);
        const invalidItems = items.filter(item => !validProductIds.includes(item.id));

        if (invalidItems.length > 0) {
            throw new Error(`Các sản phẩm sau không hợp lệ: ${invalidItems.map(i => i.id).join(", ")}`);
        }

        // Xử lý đặt hàng và cập nhật tồn kho
        const orderItemsValues = [];
        const stockUpdates = [];

        for (let item of items) {
            const productId = Number(item.id); // Ép kiểu chính xác
            const product = products.find(p => p.id === productId);

            if (!product) continue;
            if (product.stock < item.quantity) {
                throw new Error(`Không đủ hàng cho sản phẩm ${productId} (Còn: ${product.stock})`);
            }

            const totalPrice = parseFloat(product.price) * item.quantity;
            orderItemsValues.push([orderId, productId, item.quantity, totalPrice]);

            stockUpdates.push({ id: productId, newStock: product.stock - item.quantity });
        }

        if (orderItemsValues.length === 0) {
            throw new Error("Không có sản phẩm hợp lệ để đặt hàng");
        }

        // Chèn vào bảng order_items
        const orderItemsQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`;
        await connection.query(orderItemsQuery, [orderItemsValues]);

        // Cập nhật tồn kho sản phẩm
        for (let item of stockUpdates) {
            await connection.execute(`UPDATE products SET stock = ? WHERE id = ?`, [item.newStock, item.id]);
        }

        await connection.commit(); // Xác nhận transaction

         // Gửi email xác nhận
         try {
            await sendConfirmationEmail(orderId, email);
            console.log('Email xác nhận đã được gửi thành công.');
        } catch (emailError) {
            console.error('Lỗi khi gửi email xác nhận:', emailError);
            // Xử lý lỗi gửi email (ví dụ: ghi log)
        }

        res.status(201).json({
            message: "Tạo đơn hàng thành công",
            orderId,
            items,
            totalAmount,
            paymentMethod,
            paymentStatus,
            status: orderStatus,
        });
    } catch (err) {
        if (connection) await connection.rollback(); // Rollback nếu có lỗi
        console.error("Lỗi khi tạo đơn hàng:", err.message);
        return res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: err.message });
    } finally {
        if (connection) connection.release(); // Giải phóng kết nối
    }
});

module.exports = router;