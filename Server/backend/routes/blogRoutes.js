const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import connection pool MySQL
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🟢 Cấu hình Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../public/uploads/");
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });


// 🟢 API Admin đăng bài viết (Mặc định admin, không cần user_id)
router.post("/create", upload.single("image"), async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { title, content } = req.body;
        const image = req.file ? req.file.filename : null;
        const admin_id = 6; 

        if (!title || !content) {
            return res.status(400).json({ error: "Thiếu thông tin bài viết" });
        }

        const sql = image
            ? "INSERT INTO blogs (user_id, title, content, image, created_at) VALUES (?, ?, ?, ?, NOW())"
            : "INSERT INTO blogs (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())";

        const params = image ? [admin_id, title, content, image] : [admin_id, title, content];

        const [result] = await connection.execute(sql, params);
        res.status(201).json({ message: "✅ Bài viết đã được đăng", blog_id: result.insertId });

    } catch (err) {
        console.error("❌ Lỗi khi đăng bài:", err);
        return res.status(500).json({ error: "Lỗi khi đăng bài", details: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// 🟢 API Admin lấy danh sách tất cả bài viết (có phân trang)
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
        const limit = parseInt(req.query.limit) || 10; // Số lượng bài viết trên mỗi trang (mặc định là 10)
        const offset = (page - 1) * limit;

        const sql = `
            SELECT b.*, u.fullname AS author, COUNT(bl.id) AS likes 
            FROM blogs b 
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN blog_likes bl ON b.id = bl.blog_id 
            GROUP BY b.id, u.fullname 
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?;
        `;

        const [results] = await connection.execute(sql, [limit, offset]);

        const formattedResults = results.map(blog => ({
            ...blog,
            image: blog.image
                ? `http://localhost:4000/uploads/${blog.image}`
                : "/default-blog.jpg",
        }));

        // Lấy tổng số lượng bài viết để tính toán số trang
        const [countResult] = await connection.execute("SELECT COUNT(*) AS total FROM blogs");
        const totalBlogs = countResult[0].total;
        const totalPages = Math.ceil(totalBlogs / limit);

        res.json({
            blogs: formattedResults,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalBlogs
        });

    } catch (err) {
        console.error("🔥 Lỗi truy vấn SQL:", err);
        return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu", error: err });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});
router.put('/:blog_id', upload.single("image"), async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { blog_id } = req.params;
        let { user_id, title, content } = req.body; // Declare with let to modify

        if (!blog_id || isNaN(blog_id)) {
            return res.status(400).json({ error: 'blog_id không hợp lệ' });
        }

        // Lấy thông tin bài viết hiện tại
        const [rows] = await connection.execute('SELECT image FROM blogs WHERE id = ?', [blog_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }
        const existingBlog = rows[0];

        // Check if user_id is undefined, and set it to null or a default value
        if (user_id === undefined) {
            user_id = null; // Or a default user ID if appropriate
        }

        // Check and handle other fields as well
        title = title === undefined ? null : title;
        content = content === undefined ? null : content;

        let image = null;
        if (req.file){
            image = req.file.filename
        }
        else{
            image = existingBlog.image
        }

        let sql = 'UPDATE blogs SET user_id = ?, title = ?, content = ?, image = ? WHERE id = ?';
        // all values has to update , include the newImage
        let params = [user_id, title, content, image, blog_id];

        const [result] = await connection.execute(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy bài viết để cập nhật" });
        }

        res.json({ message: 'Bài viết đã được cập nhật' });

    } catch (error) {
        console.error("Lỗi khi cập nhật bài viết:", error);
        return res.status(500).json({ error: "Lỗi khi cập nhật bài viết" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 🟢 API Admin xóa bài viết
router.delete('/:blog_id', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { blog_id } = req.params;

        if (!blog_id || isNaN(blog_id)) {
            return res.status(400).json({ error: 'blog_id không hợp lệ' });
        }

        // Lấy thông tin bài viết hiện tại
        const [rows] = await connection.execute('SELECT * FROM blogs WHERE id = ?', [blog_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }
        const existingBlog = rows[0];

        const [result] = await connection.execute('DELETE FROM blogs WHERE id = ?', [blog_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy bài viết để xóa" });
        }

        // Xóa ảnh nếu có
        if (existingBlog.image) {
            const imagePath = path.join(__dirname, "../public/uploads/", existingBlog.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.warn(`Không thể xóa ảnh: ${existingBlog.image}`, err);
                }
            });
        }

        res.json({ message: 'Bài viết đã được xóa' });

    } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        return res.status(500).json({ error: "Lỗi khi xóa bài viết" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;