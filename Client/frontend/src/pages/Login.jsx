import React from "react";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Icon cho email và mật khẩu
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Đăng Nhập */}
        <div className="auth-section">
          <h2 className="text_title_login">Đăng Nhập</h2>
          <div className="auth-form">
            <div className="auth-input">
              <FaEnvelope className="input-icon" />
              <input type="email" placeholder="Email" />
            </div>
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Mật khẩu" />
            </div>
            <p className="auth-link">
              Chưa có tài khoản? <Link to="/Register">Đăng ký ngay</Link>
            </p>
            <button className="auth-button">Đăng Nhập</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
