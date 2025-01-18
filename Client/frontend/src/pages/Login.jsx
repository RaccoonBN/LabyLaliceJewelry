import React from "react";
import { FaUser, FaLock } from "react-icons/fa"; // Import các icon
import "./Login.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Đăng Nhập */}
        <div className="auth-section">
          <h2 className="text_title_login">Đăng Nhập</h2>
          <div className="auth-form">
            <div className="auth-input">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Tên đăng nhập" />
            </div>
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Mật khẩu" />
            </div>
            <p className="auth-link">Chưa có tài khoản? Đăng ký ngay</p>
            <button className="auth-button">Đăng Nhập</button>
          </div>
        </div>

        {/* Đăng Ký */}
        <div className="auth-section">
          <h2 className="text_title_loginlogin">Đăng Ký</h2>
          <div className="auth-form">
            <div className="auth-input">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Tên đăng nhập" />
            </div>
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Mật khẩu" />
            </div>
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Nhập lại mật khẩu" />
            </div>
            <p className="auth-link">Đã có tài khoản? Đăng nhập ngay</p>
            <button className="auth-button">Đăng Ký</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
