const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import file kết nối MySQL

const app = express();
const PORT = 4000;

// Middleware để xử lý JSON
app.use(bodyParser.json());

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
