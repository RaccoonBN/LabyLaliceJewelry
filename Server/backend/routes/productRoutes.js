const express = require("express");
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

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
router.get("/", (req, res) => {
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
  
    db.query(query, queryParams, (err, results) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
  
      const products = results.map(product => ({
        ...product,
        image: product.image ? `http://localhost:4000/uploads/${product.image}` : null,
      }));
  
      res.json(products);
    });
  });
  
  

// 🟢 API lấy sản phẩm theo ID
router.get("/product/:id", (req, res) => {
  db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const product = results[0];
    product.image = product.image ? `http://localhost:4000/uploads/${product.image}` : null;
    res.json(product);
  });
});

// 🟢 API lấy sản phẩm theo danh mục
router.get("/category/:categoryName", (req, res) => {
  const { categoryName } = req.params;
  db.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE c.name = ?`,
    [categoryName],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn sản phẩm theo danh mục" });

      result.forEach(product => {
        product.image = product.image ? `http://localhost:4000/uploads/${product.image}` : null;
      });

      res.json(result);
    }
  );
});

// 🟢 API thêm sản phẩm
router.post("/product", upload.single("image"), (req, res) => {
    const { name, description, price, stock, category_id, collection_id } = req.body;
    const image = req.file ? req.file.filename : null;
  
    // Truy vấn lấy category_id từ tên danh mục
    db.query("SELECT id FROM categories WHERE name = ?", [category_id], (err, categoryResults) => {
      if (err || categoryResults.length === 0) {
        return res.status(400).json({ error: "Danh mục không tồn tại" });
      }
  
      const categoryId = categoryResults[0].id;
  
      // Truy vấn lấy collection_id từ tên bộ sưu tập
      db.query("SELECT id FROM collections WHERE name = ?", [collection_id], (err, collectionResults) => {
        if (err || collectionResults.length === 0) {
          return res.status(400).json({ error: "Bộ sưu tập không tồn tại" });
        }
  
        const collectionId = collectionResults[0].id;
  
        db.query(
          "INSERT INTO products (name, description, price, stock, category_id, collection_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name, description, price, stock, categoryId, collectionId, image],
          (err, result) => {
            if (err) {
              console.error("❌ Lỗi MySQL:", err.sqlMessage);
              return res.status(500).json({ error: "Lỗi khi thêm sản phẩm", details: err.sqlMessage });
            }
  
            res.json({ message: "✅ Thêm sản phẩm thành công", productId: result.insertId });
          }
        );
      });
    });
  });
  
  

// 🟢 API cập nhật sản phẩm
router.put("/product/:id", upload.single("image"), (req, res) => {
    console.log("🔹 Nhận request cập nhật:", req.body);
    console.log("🔹 Ảnh tải lên:", req.file);
  
    const { name, description, price, stock, category_id, collection_id } = req.body;
    const newImage = req.file ? req.file.filename : null;
  
    db.query("SELECT image FROM products WHERE id = ?", [req.params.id], (err, results) => {
      if (err) {
        console.error("🔴 Lỗi truy vấn SELECT:", err);
        return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
      }
  
      if (results.length === 0) {
        console.warn("🟠 Không tìm thấy sản phẩm:", req.params.id);
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
  
      const oldImage = results[0].image;
      const image = newImage || oldImage;
  
      db.query(
        "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, collection_id = ?, image = ? WHERE id = ?",
        [name, description, price, stock, category_id, collection_id, image, req.params.id],
        (updateErr, result) => {
          if (updateErr) {
            console.error("🔴 Lỗi khi cập nhật sản phẩm:", updateErr);
            return res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
          }
  
          console.log("✅ Cập nhật thành công:", result);
          res.json({ message: "Cập nhật thành công", image });
        }
      );
    });
  });

// 🟢 API xóa sản phẩm
router.delete("/product/:id", (req, res) => {
  // Lấy ảnh để xóa trước khi xóa sản phẩm
  db.query("SELECT image FROM products WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn CSDL" });

    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const image = results[0].image;

    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (deleteErr) => {
      if (deleteErr) return res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });

      // Xóa ảnh nếu tồn tại
      if (image) {
        const imagePath = path.join(__dirname, "../public/uploads/", image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.json({ message: "Xóa thành công" });
    });
  });
});

module.exports = router;
