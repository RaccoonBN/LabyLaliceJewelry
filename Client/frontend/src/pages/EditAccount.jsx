import React, { useState } from 'react';
import './EditAccount.css';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material'; 
import { FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa';

const EditAccount = () => {
  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [userEmail, setUserEmail] = useState('nguyenvana@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    console.log("Cập nhật tài khoản:", { fullName, userEmail, newPassword });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="account-edit-container">
      <div className="account-edit-form">
        <h2 className="form-title">Chỉnh Sửa Tài Khoản</h2>
        <form onSubmit={handleFormSubmit}>
          {/* Họ Tên và Email nằm cùng một hàng */}
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

          {/* Mật Khẩu Mới và Xác Nhận Mật Khẩu nằm cùng một hàng */}
          <div className="input-group">
            <div className="input-field">
              <TextField
                label="Mật Khẩu Mới"
                variant="outlined"
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputProps={{
                  readOnly: !isEditingPassword,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
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
                required
                InputProps={{
                  readOnly: !isEditingPassword,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility}>
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

          {/* Nút Lưu Thay Đổi */}
          <div className="input-group">
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              id="save-changes-button"
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
