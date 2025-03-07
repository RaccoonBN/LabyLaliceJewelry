const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import file kết nối MySQL
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = 4000;
const cors = require("cors");
const categoryRoutes = require("./routes/categoriesRoutes");
const collectionRoutes = require("./routes/collectionRoutes");

// Middleware để xử lý JSON
app.use(bodyParser.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/collections", collectionRoutes);

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
