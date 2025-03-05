import React from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // Import các icon
import "./Register.css";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="auth-container">
      <div className="auth-content">

        {/* Đăng Ký */}
        <div className="auth-section">
          <h2 className="text_title_register">Đăng Ký</h2>
          <div className="auth-form">
            <div className="auth-input">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Họ và Tên" />
            </div>
            <div className="auth-input">
              <FaEnvelope className="input-icon" />
              <input type="email" placeholder="Email" />
            </div>
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Mật khẩu" />
            </div>
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Nhập lại mật khẩu" />
            </div>
            <p className="auth-link">
              Đã có tài khoản? <Link to="/Login">Đăng nhập ngay</Link>
            </p>
            <button className="auth-button">Đăng Ký</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
