import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaBell,
  FaShoppingCart,
  FaUser,
  FaCog,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./header.css";
import logo from "../assets/logo.png";
import DropdownMenu from "./dropdownMenu";
import NotificationModal from "./NotificationModal";

const Header = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/all-products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:2000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          setUser(response.data);
          setIsLoggedIn(true);
        })
        .catch(error => {
          if (error.response && error.response.status === 403) {
            console.error("Token hết hạn hoặc không hợp lệ.");
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            navigate("/login");
          } else {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            setIsLoggedIn(false);
          }
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchCartCount(user.id);
      fetchUnreadCount(user.id); // Lấy số lượng thông báo chưa đọc
    }
  }, [user]);

  const fetchCartCount = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:2000/cart/count/${userId}`);
      console.log("Dữ liệu giỏ hàng từ API:", response.data);

      // Chuyển total_count thành số (number)
      const count = Number(response.data.total_count);
      setCartCount(count);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
    }
  };

  const fetchUnreadCount = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:2000/notifications/count?userId=${userId}`);
      setUnreadCount(response.data.unreadCount); // Cập nhật state
    } catch (error) {
      console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchUnreadCount(user?.id);  // Refresh count when modal closes
  };

  const handleUserIconClick = () => isLoggedIn && setIsUserDropdownOpen(prev => !prev);
  const handleCartClick = () => navigate(isLoggedIn ? "/cart" : "/login");
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <header>
        <div className="header-first">
          <div className="search-container">
            <FaSearch className="search-icon" onClick={handleSearch} />
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="logo" onClick={() => {
            setSelectedItem(null); // Bỏ chọn tất cả menu
            navigate("/");
          }}>
            <img src={logo} alt="Logo" />
          </div>
          <div className="icons">
            {isLoggedIn ? (
              <>
                {/* 🔔 Icon thông báo */}
                <div className="icon-container">
                  <FaBell className="icon" onClick={openModal} />
                  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </div>

                {/* 🛒 Icon giỏ hàng */}
                <div className="icon-container">
                  <FaShoppingCart className="icon" onClick={handleCartClick} />
                  {cartCount > 0 ? (
                    <span className="badge">{cartCount}</span>
                  ) : (
                    console.log("Giỏ hàng trống, không hiển thị badge")
                  )}
                </div>

                {/* 👤 User Icon */}
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
            <Link to="/all-products">SẢN PHẨM</Link>
          </div>
          <div className={`menu-item ${selectedItem === "news" ? "active" : ""}`} onClick={() => setSelectedItem("news")}>
            <Link to="/BlogPage">BLOG TIN TỨC</Link>
          </div>
        </div>
        <NotificationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          userId={user?.id}
        />
      </header>
    </>
  );
};

export default Header;