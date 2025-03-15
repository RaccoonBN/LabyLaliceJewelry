const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// 🟢 Cấu hình Multer để lưu file vào thư mục `public/uploads/`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../../Server/backend/public/uploads/");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// 🟢 API đăng bài viết (Không dùng Promise)
router.post("/create", upload.single("image"), (req, res) => {
    const { user_id, title, content } = req.body;
    const image = req.file ? req.file.filename : null;
  
    if (!user_id || !title || !content) {
      return res.status(400).json({ error: "Thiếu thông tin bài viết" });
    }
  
    const sql = image
      ? "INSERT INTO blogs (user_id, title, content, image, created_at) VALUES (?, ?, ?, ?, NOW())"
      : "INSERT INTO blogs (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())";
  
    const params = image ? [user_id, title, content, image] : [user_id, title, content];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ Lỗi khi đăng bài:", err);
        return res.status(500).json({ error: "Lỗi khi đăng bài", details: err.message });
      }
      res.status(201).json({ message: "✅ Bài viết đã được đăng", blog_id: result.insertId });
    });
  });

// 🟢 API Lấy danh sách bài viết kèm ảnh
router.get('/blogs', (req, res) => {
    const sql = `
        SELECT b.*, u.fullname AS author, COUNT(bl.id) AS likes 
        FROM blogs b 
        LEFT JOIN users u ON b.user_id = u.id  -- Lấy fullname từ bảng users
        LEFT JOIN blog_likes bl ON b.id = bl.blog_id 
        GROUP BY b.id, u.fullname 
        ORDER BY b.created_at DESC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("🔥 Lỗi truy vấn SQL:", err);
            return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu", error: err });
        }

        // Xử lý hình ảnh: nếu không có ảnh thì dùng ảnh mặc định
        const formattedResults = results.map(blog => ({
            ...blog,
            image: blog.image
                ? `http://localhost:4000/uploads/${blog.image}`  // ✅ Đường dẫn đầy đủ
                : "/default-blog.jpg",  // ✅ Ảnh mặc định nếu không có ảnh
        }));

        console.log("✅ Dữ liệu bài viết sau khi xử lý:", formattedResults);
        res.json(formattedResults);
    });
});


// 🟢 API Like / Unlike bài viết
// 🟢 API Like / Unlike bài viết
router.post('/blogs/:blog_id/like', async (req, res) => {
    try {
        const { user_id } = req.body;
        const { blog_id } = req.params;

        console.log("📌 Dữ liệu nhận từ client:", { user_id, blog_id });

        if (!user_id) {
            return res.status(400).json({ error: 'Thiếu thông tin user_id' });
        }
        if (!blog_id || isNaN(blog_id)) {
            return res.status(400).json({ error: 'blog_id không hợp lệ' });
        }

        // ✅ Kiểm tra xem user đã like bài viết chưa
        const result = await db.execute(
            'SELECT * FROM blog_likes WHERE user_id = ? AND blog_id = ?',
            [user_id, blog_id]
        );

        // ✅ Lấy dữ liệu từ `_rows` thay vì `[rows]`
        const rows = result._rows || []; 
        console.log("🟢 Kết quả truy vấn blog_likes:", rows);

        if (rows.length > 0) {
            // Nếu đã like, thì unlike
            await db.execute(
                'DELETE FROM blog_likes WHERE user_id = ? AND blog_id = ?',
                [user_id, blog_id]
            );
            console.log("🔄 Người dùng đã bỏ like bài viết.");
            return res.json({ message: 'Đã bỏ like bài viết' });
        }

        // Nếu chưa like, thì thêm vào bảng
        await db.execute(
            'INSERT INTO blog_likes (user_id, blog_id, created_at) VALUES (?, ?, NOW())',
            [user_id, blog_id]
        );
        console.log("❤️ Người dùng đã like bài viết.");
        return res.json({ message: 'Đã like bài viết' });

    } catch (error) {
        console.error("❌ Lỗi khi thực hiện thao tác like:", error);
        return res.status(500).json({ 
            error: 'Lỗi khi thực hiện thao tác like', 
            details: error.message 
        });
    }
});


module.exports = router;
