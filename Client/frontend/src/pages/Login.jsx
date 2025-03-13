import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Thêm ToastContainer
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:2000/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        toast.success("Đăng nhập thành công! Đang chuyển hướng...", {
          position: "top-right",
        });

        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Đăng nhập thất bại!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer /> {/* Đảm bảo toast hiển thị */}
      <div className="auth-content">
        <div className="auth-section">
          <h2 className="text_title_login">Đăng Nhập</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="auth-link">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
            <button type="submit" className="auth-button">Đăng Nhập</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
