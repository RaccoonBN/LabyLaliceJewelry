import React, { useState } from "react";
import "./user.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserManagement = () => {
  // Danh sách người dùng giả lập
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", password: "123456" },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", password: "abcdef" },
    { id: 3, name: "Lê Văn C", email: "c@gmail.com", password: "qwerty" },
  ]);

  // Trạng thái chỉnh sửa
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  // Hàm mở modal sửa
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedPassword(user.password);
  };

  // Hàm lưu chỉnh sửa
  const handleSave = () => {
    setUsers(users.map((user) => 
      user.id === editingUser.id ? { ...user, name: editedName, email: editedEmail, password: editedPassword } : user
    ));
    setEditingUser(null);
  };

  // Hàm xóa người dùng
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
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
              <td>{user.name}</td>
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
