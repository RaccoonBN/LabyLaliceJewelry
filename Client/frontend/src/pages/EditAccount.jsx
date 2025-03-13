import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditAccount.css';

const EditAccount = () => {
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // 🔹 Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // 🔹 Lấy thông tin người dùng từ token
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:2000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }, // Thêm 'Bearer' trước token
        });

        setUserId(response.data.id);
        setFullName(response.data.fullname);
        setUserEmail(response.data.email);
      } catch (err) {
        toast.error("Không thể tải thông tin tài khoản!");
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      const response = await axios.put("http://localhost:2000/auth/edit-account", 
        {
          id: userId,
          fullname: fullName,
          email: userEmail,
          newPassword: newPassword || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message);
      setIsEditingFullName(false);
      setIsEditingEmail(false);
      setIsEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="account-edit-container">
      <ToastContainer autoClose={3000} /> {/* Đảm bảo toast hiển thị */}

      <div className="account-edit-form">
        <h2 className="form-title">Chỉnh Sửa Tài Khoản</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <div className="input-field">
              <TextField
                label="Họ Tên"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                InputProps={{
                  readOnly: !isEditingFullName,
                  endAdornment: (
                    <InputAdornment position="end">
                      {!isEditingFullName && (
                        <IconButton onClick={() => setIsEditingFullName(true)}>
                          <FaEdit />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="input-field">
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                InputProps={{
                  readOnly: !isEditingEmail,
                  endAdornment: (
                    <InputAdornment position="end">
                      {!isEditingEmail && (
                        <IconButton onClick={() => setIsEditingEmail(true)}>
                          <FaEdit />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-field">
              <TextField
                label="Mật Khẩu Mới"
                variant="outlined"
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  readOnly: !isEditingPassword,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                      {!isEditingPassword && (
                        <IconButton onClick={() => setIsEditingPassword(true)}>
                          <FaEdit />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="input-field">
              <TextField
                label="Xác Nhận Mật Khẩu"
                variant="outlined"
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  readOnly: !isEditingPassword,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                        {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                      {!isEditingPassword && (
                        <IconButton onClick={() => setIsEditingPassword(true)}>
                          <FaEdit />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccount;
