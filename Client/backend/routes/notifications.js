const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import connection pool (đã sửa)


// 1. Lấy thông báo cho người dùng cụ thể
router.get("/", async (req, res) => {
    const userId = req.query.userId;
  
    if (!userId) {
      return res.status(400).json({ message: "Thiếu user ID" });
    }
  
    try {
      // Lấy danh sách thông báo
      const [rows] = await pool.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
  
      // Lấy số lượng thông báo chưa đọc
      const [unreadCountResult] = await pool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND is_read = FALSE",
        [userId]
      );
      const unreadCount = unreadCountResult[0].unreadCount;
  
      res.json({
        notifications: rows,
        unreadCount: unreadCount,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

// 2. Đánh dấu thông báo là đã đọc
router.put("/:id/read", async (req, res) => {
    const notificationId = req.params.id;
  
    try {
      const [result] = await pool.query(
        "UPDATE notifications SET is_read = TRUE WHERE id = ?",
        [notificationId]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Thông báo không tìm thấy" });
      }
  
      res.json({ message: "Thông báo đã được đánh dấu là đã đọc" });
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });
  
  // 3. Đánh dấu tất cả thông báo là đã đọc cho người dùng
  router.put("/mark-all-read", async (req, res) => {
    const userId = req.body.userId;
  
    if (!userId) {
      return res.status(400).json({ message: "Thiếu user ID trong body" });
    }
  
    try {
      const [result] = await pool.query(
        "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
        [userId]
      );
  
      res.json({
        message: "Tất cả thông báo đã được đánh dấu là đã đọc cho người dùng " + userId,
      });
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });
// API để lấy số lượng thông báo chưa đọc
router.get("/count", async (req, res) => {
    const userId = req.query.userId;
  
    if (!userId) {
      return res.status(400).json({ message: "Thiếu user ID" });
    }
  
    try {
      const [unreadCountResult] = await pool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND is_read = FALSE",
        [userId]
      );
      const unreadCount = unreadCountResult[0].unreadCount;
  
      res.json({ unreadCount });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });
module.exports = router;