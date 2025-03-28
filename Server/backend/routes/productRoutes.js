const express = require("express");
const router = express.Router();
const pool = require("../db"); // Cấu hình connection pool MySQL
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🟢 Cấu hình lưu file vào thư mục backend/public/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../public/uploads/");
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

// 🟢 API lấy danh sách sản phẩm
router.get("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { category_id, collection_id, sort } = req.query;

        let query = `
            SELECT products.*, categories.name AS category_name, collections.name AS collection_name
            FROM products
            LEFT JOIN categories ON products.category_id = categories.id
            LEFT JOIN collections ON products.collection_id = collections.id
            WHERE 1
        `;

        const queryParams = [];
        if (category_id) {
            query += " AND products.category_id = ?";
            queryParams.push(category_id);
        }
        if (collection_id) {
            query += " AND products.collection_id = ?";
            queryParams.push(collection_id);
        }

        if (sort === "priceAsc") {
            query += " ORDER BY products.price ASC";
        } else if (sort === "priceDesc") {
            query += " ORDER BY products.price DESC";
        } else {
            query += " ORDER BY products.created_at DESC"; // Sắp xếp mới nhất
        }

        const [results] = await connection.execute(query, queryParams);

        const products = results.map(product => ({
            ...product,
            image: product.image ? `http://localhost:4000/uploads/${product.image}` : null,
        }));

        res.json(products);
    } catch (err) {
        console.error("Lỗi truy vấn CSDL:", err);
        return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 🟢 API lấy sản phẩm theo ID
router.get("/product/:id", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);

        if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        const product = results[0];
        product.image = product.image ? `http://localhost:4000/uploads/${product.image}` : null;
        res.json(product);
    } catch (err) {
        console.error("Lỗi truy vấn CSDL:", err);
        return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 🟢 API lấy sản phẩm theo danh mục
router.get("/category/:categoryName", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { categoryName } = req.params;
        const sql = `
            SELECT p.*, c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE c.name = ?
        `;
        const [results] = await connection.execute(sql, [categoryName]);

        results.forEach(product => {
            product.image = product.image ? `http://localhost:4000/uploads/${product.image}` : null;
        });

        res.json(results);
    } catch (err) {
        console.error("Lỗi truy vấn sản phẩm theo danh mục:", err);
        return res.status(500).json({ error: "Lỗi truy vấn sản phẩm theo danh mục" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 🟢 API thêm sản phẩm
router.post("/product", upload.single("image"), async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { name, description, price, stock, category_id, collection_id } = req.body;
        const image = req.file ? req.file.filename : null;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !description || !price || !stock || !category_id || !collection_id) {
            return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
        }

        // Chèn vào database
        const sql = `
            INSERT INTO products (name, description, price, stock, category_id, collection_id, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.execute(sql, [name, description, price, stock, category_id, collection_id, image]);

        res.json({ message: "✅ Thêm sản phẩm thành công", productId: result.insertId });
    } catch (err) {
        console.error("Lỗi khi thêm sản phẩm:", err);
        return res.status(500).json({ error: "Lỗi khi thêm sản phẩm", details: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 🟢 API cập nhật sản phẩm
router.put("/product/:id", upload.single("image"), async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("🔹 Nhận request cập nhật:", req.body);
        console.log("🔹 Ảnh tải lên:", req.file);

        const { name, description, price, stock, category_id, collection_id } = req.body;
        const newImage = req.file ? req.file.filename : null;
        const productId = req.params.id;

        // Lấy ảnh cũ từ database
        const [results] = await connection.execute("SELECT image FROM products WHERE id = ?", [productId]);

        if (results.length === 0) {
            console.warn("🟠 Không tìm thấy sản phẩm:", productId);
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        const oldImage = results[0].image;
        const image = newImage || oldImage;

        // Cập nhật sản phẩm
        const sql = `
            UPDATE products
            SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, collection_id = ?, image = ?
            WHERE id = ?
        `;
        await connection.execute(sql, [name, description, price, stock, category_id, collection_id, image, productId]);

        console.log("✅ Cập nhật thành công:");
        res.json({ message: "Cập nhật thành công", image });
    } catch (err) {
        console.error("Lỗi khi cập nhật sản phẩm:", err);
        return res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// 🟢 API xóa sản phẩm
router.delete("/product/:id", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const productId = req.params.id;

        // Lấy ảnh để xóa trước khi xóa sản phẩm
        const [results] = await connection.execute("SELECT image FROM products WHERE id = ?", [productId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        const image = results[0].image;

        // Xóa sản phẩm
        await connection.execute("DELETE FROM products WHERE id = ?", [productId]);

        // Xóa ảnh nếu tồn tại
        if (image) {
            const imagePath = path.join(__dirname, "../public/uploads/", image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ message: "Xóa thành công" });
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        return res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;