const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // Kết nối MySQL

// Import các route
const productRoutes = require("./routes/product");
const reviewsRouter = require("./routes/reviews");
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const postRoutes = require("./routes/post")
const collectionRoutes = require("./routes/collection")
const app = express();
const PORT = 2000;

// Middleware xử lý JSON & CORS
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000", // Cho phép frontend truy cập API
    credentials: true, // Hỗ trợ cookie & token
}));

app.use('/uploads', express.static(path.join(__dirname, '../../../Server/backend/public/uploads')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/src/assets')));

// Cấu hình API routes
app.use("/products", productRoutes);
app.use("/reviews", reviewsRouter);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/post", postRoutes);
app.use("/collections", collectionRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
