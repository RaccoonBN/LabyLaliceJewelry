import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import "./NotificationModal.css";
import axios from "axios";
import { Link } from "react-router-dom";

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get("http://localhost:2000/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserId(response.data.id);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:2000/notifications?userId=${userId}`);

          // Kiểm tra phản hồi từ API
          if (response.data && typeof response.data === 'object' && Array.isArray(response.data.notifications)) {
            setNotifications(response.data.notifications); // Truy cập thuộc tính notifications
            setUnreadCount(response.data.unreadCount);       // Truy cập thuộc tính unreadCount
          } else {
            console.error("Dữ liệu trả về từ API không hợp lệ:", response.data);
            setNotifications([]); // Đặt là một mảng rỗng để tránh lỗi
            setUnreadCount(0);     // Đặt số lượng chưa đọc về 0
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông báo:", error);
          setNotifications([]); // Đặt là một mảng rỗng để tránh lỗi
          setUnreadCount(0);     // Đặt số lượng chưa đọc về 0
        }
      }
    };

    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:2000/notifications/${id}/read`);
      setNotifications(prevNotifications => // Sử dụng functional update
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
    }
  };

  const markAllAsRead = async () => {
    if (userId) {
      try {
        await axios.put(`http://localhost:2000/notifications/mark-all-read`, { userId: userId });
        setNotifications(prevNotifications => // Sử dụng functional update
          prevNotifications.map((notification) => ({ ...notification, ...{ is_read: true } }))
        );
        setUnreadCount(0);
      } catch (error) {
        console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
      }
    }
  };

  return (
    <div className={`custom-modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <h3>Thông báo</h3>
          <button className="custom-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="custom-modal-body">
          <button className="custom-mark-all-read" onClick={markAllAsRead}>
            Đánh dấu tất cả là đã đọc
          </button>
          <ul className="custom-notification-list">
            {notifications.map((notification) => {
              const notificationData = notification.data ? JSON.parse(notification.data) : null;

              return (
                <li key={notification.id} className={notification.is_read ? "read" : ""}>
                  <div className="custom-notification-item">
                    <span
                      onClick={() => markAsRead(notification.id)}
                      className="custom-notification-icon"
                    >
                      {notification.is_read ? (
                        <FaCheckCircle />
                      ) : (
                        <FaRegCircle />
                      )}
                    </span>
                    <span className="custom-notification-message">
                      {notification.type === "order_update" && notificationData && (
                        <Link to={`/orders/${notificationData.orderId}`}>{notification.message}</Link>
                      )}
                      {notification.type === "blog_like" && notificationData && (
                        <Link to={`/news/${notificationData.blogId}`}>{notification.message}</Link>
                      )}
                      {notification.type !== "order_update" && notification.type !== "blog_like" && (
                        <span>{notification.message}</span>
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;