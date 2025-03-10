const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import file kết nối MySQL
const productRoutes = require("./routes/product");
const cors = require('cors');

const app = express();
const PORT = 2000;

// Middleware để xử lý JSON
app.use(bodyParser.json());
app.use(cors());

app.use("/products", productRoutes);

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
