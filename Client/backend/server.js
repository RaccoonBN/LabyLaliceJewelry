const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import file kết nối MySQL
const productRoutes = require("./routes/product");
const reviewsRouter = require("./routes/reviews"); 
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");

const cors = require('cors');

const app = express();
const PORT = 2000;

// Middleware để xử lý JSON
app.use(bodyParser.json());
app.use(cors());

app.use("/products", productRoutes);
app.use("/reviews", reviewsRouter);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
