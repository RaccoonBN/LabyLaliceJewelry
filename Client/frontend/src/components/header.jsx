import React, { useState, useEffect } from "react";
import { FaSearch, FaBell, FaShoppingCart, FaUser, FaCog, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./header.css";
import logo from "../assets/logo.png";
import DropdownMenu from "./dropdownMenu";

const Header = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    console.log("Token trong localStorage: ", token);
    
    if (token) {
      axios.get("http://localhost:2000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setUser(response.data);
        setIsLoggedIn(true);
      })
      .catch(error => {
        if (error.response && error.response.status === 403) {
          console.error("Token hết hạn hoặc không hợp lệ. Đăng nhập lại.");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login"); // Chuyển hướng đến trang đăng nhập
        } else {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setIsLoggedIn(false);
        }
      });
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setIsUserDropdownOpen(prev => !prev);
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate("/login"); // Chuyển hướng tới trang đăng nhập nếu chưa đăng nhập
    }
  };

  const handleNotificationClick = () => {
    if (isLoggedIn) {
      navigate("/notifications");
    } else {
      navigate("/login"); // Chuyển hướng tới trang đăng nhập nếu chưa đăng nhập
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login"); // Chuyển hướng tới trang đăng nhập sau khi đăng xuất
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <header>
        <div className="header-first">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Tìm kiếm" />
          </div>
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" />
          </div>
          <div className="icons">
            {isLoggedIn ? (
              <>
                <FaBell className="icon" onClick={handleNotificationClick} />
                <FaShoppingCart className="icon" onClick={handleCartClick} />
                <div className="user-icon">
                  <FaUser className="icon" onClick={handleUserIconClick} />
                  {isUserDropdownOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-item" onClick={() => navigate("/edit-account")}>
                        <FaCog className="dropdown-icon" /> Chỉnh sửa tài khoản
                      </div>
                      <div className="dropdown-item" onClick={() => navigate("/order-history")}>
                        <FaHistory className="dropdown-icon" /> Lịch sử đơn hàng
                      </div>
                      <div className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className="dropdown-icon" /> Đăng xuất
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="login-button">
                <Link to="/login">ĐĂNG NHẬP</Link>
              </div>
            )}
          </div>
        </div>

        <div className="header-second">
          <div className={`menu-item ${selectedItem === "about" ? "active" : ""}`} onClick={() => setSelectedItem("about")}>
            <Link to="/AboutUs">VỀ CHÚNG TÔI</Link>
          </div>
          <div className={`menu-item ${selectedItem === "collection" ? "active" : ""}`} onClick={() => setDropdownOpen(dropdownOpen === "collection" ? null : "collection")}>
            BỘ SƯU TẬP
            {dropdownOpen === "collection" && <DropdownMenu />}
          </div>
          <div className={`menu-item ${selectedItem === "products" ? "active" : ""}`} onClick={() => setSelectedItem("products")}>
            <Link to="/AllProduct">SẢN PHẨM</Link>
          </div>
          <div className={`menu-item ${selectedItem === "news" ? "active" : ""}`} onClick={() => setSelectedItem("news")}>
            <Link to="/BlogPage">BLOG TIN TỨC</Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
