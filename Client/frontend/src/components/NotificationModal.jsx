import React, { useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import "./NotificationModal.css"; // Thêm CSS cho modal

const NotificationModal = ({ isOpen, onClose }) => {
  // Danh sách thông báo
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Thông báo 1", read: false },
    { id: 2, message: "Thông báo 2", read: false },
    { id: 3, message: "Thông báo 3", read: true },
    { id: 4, message: "Thông báo 4", read: false },
  ]);

  // Đánh dấu thông báo là đã đọc
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
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
            {notifications.map((notification) => (
              <li key={notification.id} className={notification.read ? "read" : ""}>
                <div className="custom-notification-item">
                  <span
                    onClick={() => markAsRead(notification.id)}
                    className="custom-notification-icon"
                  >
                    {notification.read ? (
                      <FaCheckCircle />
                    ) : (
                      <FaRegCircle />
                    )}
                  </span>
                  <span className="custom-notification-message">
                    {notification.message}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
