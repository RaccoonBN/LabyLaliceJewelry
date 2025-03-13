import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import "./Register.css";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Chuyển hướng sau khi đăng ký thành công

  const handleRegister = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu hợp lệ
    if (!fullname || !email || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", { position: "top-right" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email không hợp lệ!", { position: "top-right" });
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!", { position: "top-right" });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!", { position: "top-right" });
      return;
    }

    try {
      // Gửi request đăng ký
      const response = await axios.post("http://localhost:2000/auth/register", {
        fullname,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success("Đăng ký thành công! Đang chuyển hướng...", {
          position: "top-right",
        });

        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer /> {/* Hiển thị thông báo */}
      <div className="auth-content">
        <div className="auth-section">
          <h2 className="text_title_register">Đăng Ký</h2>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Họ và Tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
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
            <div className="auth-input">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <p className="auth-link">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
            <button type="submit" className="auth-button">
              Đăng Ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
