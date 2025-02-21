const express = require("express");
const db = require("./db"); 

const app = express();
const PORT = 3000;

// API thêm dữ liệu vào Firestore
app.get("/add-data", async (req, res) => {
  try {
    const docRef = db.collection("test").add({
      message: "Hello Firestore!"
    });
    res.send("🎉 Dữ liệu đã thêm vào Firestore!");
  } catch (error) {
    res.status(500).send("❌ Lỗi Firestore: " + error.message);
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
