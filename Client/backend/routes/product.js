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
        categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Kiểm tra nếu sản phẩm không có hình ảnh, thay bằng một ảnh mặc định
      const formattedResults = results.map(product => {
        product.image = product.image 
          ? `http://localhost:4000/product/uploads/${product.image}`  // Đường dẫn hình ảnh hợp lệ
          : "/default-image.jpg"; // Ảnh mặc định khi không có hình ảnh
        return product;
      });
  
      res.json(formattedResults); // Trả về danh sách sản phẩm đã được xử lý
    });
  });
  
// Lấy sản phẩm theo id, danh mục và bộ sưu tập
router.get("/:id", (req, res) => {
  const productId = req.params.id;

  // Truy vấn thông tin sản phẩm theo ID
  const productQuery = `
    SELECT products.id, products.name, products.description, products.price, products.stock, products.image, products.category_id, products.collection_id, categories.name AS category_name, collections.name AS collection_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN collections ON products.collection_id = collections.id
    WHERE products.id = ?
  `;

  db.query(productQuery, [productId], (err, productResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (productResults.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const product = productResults[0];

    // Lấy sản phẩm liên quan (theo category_id và collection_id)
    const relatedProductsQuery = `
      SELECT products.id, products.name, products.description, products.price, products.stock, products.image
      FROM products
      WHERE (products.category_id = ? OR products.collection_id = ?)
      AND products.id != ?
    `;
    
    db.query(relatedProductsQuery, [product.category_id, product.collection_id, productId], (err, relatedProducts) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ product, relatedProducts });
    });
  });
});

module.exports = router;
