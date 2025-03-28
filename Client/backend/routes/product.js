const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import connection pool

// 🛒 API: Lấy danh sách sản phẩm (có thể lọc theo collection_id VÀ tìm kiếm)
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Lấy kết nối từ pool
    const collection_id = req.query.collection_id;
    const query = req.query.q; // Lấy từ khóa tìm kiếm từ query params

    let sqlQuery = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.image, 
        p.category_id, c.name AS category_name, 
        p.collection_id, col.name AS collection_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN collections col ON p.collection_id = col.id
      WHERE 1=1 -- Điều kiện luôn đúng để dễ dàng thêm các điều kiện khác
    `;

    let params = [];

    if (collection_id) {
      sqlQuery += " AND p.collection_id = ?";
      params.push(collection_id);
    }

    if (query) {
      sqlQuery += " AND (p.name LIKE ? OR c.name LIKE ? OR col.name LIKE ?)";
      params.push(`%${query}%`);
      params.push(`%${query}%`);
      params.push(`%${query}%`);
    }

    const [results] = await connection.execute(sqlQuery, params);

    // Xử lý ảnh mặc định nếu không có ảnh
    const formattedResults = results.map(product => {
      product.image = product.image
        ? `http://localhost:4000/uploads/${product.image}`
        : "/default-image.jpg";
      return product;
    });

    res.json(formattedResults);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    return res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
  } finally {
    if (connection) {
      connection.release(); // Trả kết nối về pool
    }
  }
});

// 🛍 API: Lấy chi tiết sản phẩm theo ID (kèm đánh giá & sản phẩm liên quan)
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Lấy kết nối từ pool
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

    const [productResults] = await connection.execute(productQuery, [productId]);

    if (productResults.length === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    let product = productResults[0];
    product.avg_rating = Number(product.avg_rating) || 0;

    // Truy vấn sản phẩm liên quan (cùng danh mục hoặc bộ sưu tập)
    const relatedProductsQuery = `
      SELECT id, name, description, price, stock, image 
      FROM products
      WHERE (category_id = ? OR collection_id = ?) AND id != ?
    `;

    const [relatedProducts] = await connection.execute(relatedProductsQuery, [product.category_id, product.collection_id, productId]);

    // Truy vấn đánh giá sản phẩm
    const reviewQuery = `
      SELECT r.id, r.user_id, r.product_id, r.rating, r.comment, r.created_at, 
             u.fullname AS username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC;
    `;

    const [reviews] = await connection.execute(reviewQuery, [productId]);

    res.json({ product, relatedProducts, reviews });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
    return res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" });
  } finally {
    if (connection) {
      connection.release(); // Trả kết nối về pool
    }
  }
});

// **LOẠI BỎ API NÀY**
// // 🔍 API: Tìm kiếm sản phẩm theo tên, danh mục hoặc bộ sưu tập
// router.get("/search", async (req, res) => {
//   let connection;
//   try {
//     connection = await pool.getConnection(); // Lấy kết nối từ pool
//     const { query } = req.query;
//     if (!query) {
//       return res.json([]);
//     }

//     const searchQuery = `
//       SELECT p.id, p.name, p.image, p.price, c.name AS category_name, col.name AS collection_name
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN collections col ON p.collection_id = col.id
//       WHERE p.name LIKE ? 
//          OR c.name LIKE ? 
//          OR col.name LIKE ? 
//     `;

//     const [results] = await connection.execute(searchQuery, [`%${query}%`, `%${query}%`, `%${query}%`]);

//     res.json(results);
//   } catch (err) {
//     console.error("Lỗi khi tìm kiếm sản phẩm:", err);
//     return res.status(500).json({ error: "Lỗi khi tìm kiếm sản phẩm" });
//   } finally {
//     if (connection) {
//       connection.release(); // Trả kết nối về pool
//     }
//   }
// });

module.exports = router;