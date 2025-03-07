import React, { useState, useEffect } from "react";
import axios from "axios";
import "./user.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:4000/users"; // API backend

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu:", error);
      });
  }, []);

  // Hàm mở modal sửa
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedName(user.fullname);
    setEditedEmail(user.email);
    setEditedPassword(user.password);
  };

  // Hàm lưu chỉnh sửa vào database
  const handleSave = () => {
    axios.put(`${API_URL}/${editingUser.id}`, {
      name: editedName,
      email: editedEmail,
      password: editedPassword,
    })
    .then(() => {
      setUsers(users.map((user) => 
        user.id === editingUser.id ? { ...user, fullname: editedName, email: editedEmail, password: editedPassword } : user
      ));
      setEditingUser(null);
    })
    .catch((error) => console.error("Lỗi cập nhật:", error));
  };

  // Hàm xóa người dùng
  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => console.error("Lỗi xóa:", error));
  };

  return (
    <div className="user-management">
      <h2>Quản lý người dùng</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal sửa người dùng */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chỉnh sửa người dùng</h3>
            <label>Tên:</label>
            <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />

            <label>Email:</label>
            <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />

            <label>Mật khẩu:</label>
            <input type="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Lưu</button>
              <button className="cancel-btn" onClick={() => setEditingUser(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
