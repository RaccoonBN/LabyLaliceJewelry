// productRoutes.js
const express = require("express");
const db = require("../db");

const router = express.Router();

// Lấy danh sách sản phẩm
router.get("/", (req, res) => {
  const query = `
    SELECT 
      products.id, 
      products.name, 
      products.description, 
      products.price, 
      products.stock, 
      products.image, 
      products.category_id,  -- ✅ Thêm cột category_id vào đây
      categories.name AS category_name,
      products.collection_id, -- ✅ Thêm collection_id nếu cần
      collections.name AS collection_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN collections ON products.collection_id = collections.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Kiểm tra nếu sản phẩm không có hình ảnh, thay bằng một ảnh mặc định
    const formattedResults = results.map(product => {
      product.image = product.image 
        ? `http://localhost:4000/uploads/${product.image}`
        : "/default-image.jpg"; 
      return product;
    });

    res.json(formattedResults); // Trả về danh sách sản phẩm đã được xử lý
  });
});


// Lấy sản phẩm theo id, danh mục và bộ sưu tập
router.get("/:id", (req, res) => {
  const productId = req.params.id;

  const productQuery = `
    SELECT p.id, p.name, p.description, p.price, p.stock, p.image, 
           p.category_id, p.collection_id, 
           c.name AS category_name, col.name AS collection_name,
           COUNT(r.id) AS review_count, 
           IFNULL(AVG(r.rating), 0) AS avg_rating
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN collections col ON p.collection_id = col.id
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.id = ?
    GROUP BY p.id;
  `;

  db.query(productQuery, [productId], (err, productResults) => {
    if (err) {
      console.error("Lỗi truy vấn sản phẩm:", err);
      return res.status(500).json({ error: "Lỗi truy vấn dữ liệu sản phẩm." });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    let product = productResults[0];
    product.avg_rating = Number(product.avg_rating) || 0; // Ép kiểu về số

    const relatedProductsQuery = `
      SELECT id, name, description, price, stock, image 
      FROM products
      WHERE (category_id = ? OR collection_id = ?) AND id != ?
    `;

    db.query(relatedProductsQuery, [product.category_id, product.collection_id, productId], (err, relatedProducts) => {
      if (err) {
        console.error("Lỗi truy vấn sản phẩm liên quan:", err);
        return res.status(500).json({ error: "Lỗi truy vấn sản phẩm liên quan." });
      }

      // Nếu không có sản phẩm liên quan
      if (relatedProducts.length === 0) {
        console.log("Không có sản phẩm liên quan.");
      }

      const reviewQuery = `
        SELECT r.id, r.user_id, r.product_id, r.rating, r.comment, r.created_at, 
               u.fullname AS username
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC;
      `;

      db.query(reviewQuery, [productId], (err, reviews) => {
        if (err) {
          console.error("Lỗi truy vấn đánh giá sản phẩm:", err);
          return res.status(500).json({ error: "Lỗi truy vấn đánh giá sản phẩm." });
        }

        res.json({ product, relatedProducts, reviews });
      });
    });
  });
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    console.log("🔍 Query nhận được từ frontend:", query); // Debug

    if (!query) return res.json([]);

    const searchQuery = `
      SELECT p.id, p.name, p.image, p.price, c.name AS category_name, col.name AS collection_name
      FROM products p
      LEFT JOIN category c ON p.idcategory = c.id
      LEFT JOIN collection col ON p.idcollection = col.id
      WHERE p.name LIKE ? 
         OR c.name LIKE ? 
         OR col.name LIKE ? 
    `;

    const [results] = await db.query(searchQuery, [`%${query}%`, `%${query}%`, `%${query}%`]);
    
    console.log("📦 Kết quả tìm kiếm:", results); // Debug
    res.json(results);
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});


module.exports = router;
