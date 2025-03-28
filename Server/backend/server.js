const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import file kết nối MySQL
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = 4000;
const cors = require("cors");
const categoryRoutes = require("./routes/categoriesRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const path = require("path");
const  productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes")

// Middleware để xử lý JSON
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./public/uploads")));
app.use("/product", productRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/collections", collectionRoutes);
app.use("/orders", orderRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  });
// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
