import React, { useState } from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaUser,FaCog, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import "./header.css";
import logo from "../assets/logo.png";
import DropdownMenu from "./dropdownMenu";

const Header = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Thêm trạng thái
  const navigate = useNavigate();

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setDropdownOpen(null);
  };

  const handleLogoClick = () => {
    navigate("/"); // Điều hướng về trang Home
  };

  const handleUserIconClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen); // Toggle dropdown User
  };

  const handleDropdownToggle = (item) => {
    setDropdownOpen(dropdownOpen === item ? null : item);
  };

  return (
    <header>
      {/* Thanh đầu tiên */}
      <div className="header-first">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Tìm kiếm" />
        </div>
        <div className="logo" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" />
        </div>
        <div className="icons">
          <FaHeart className="icon" />
          <FaShoppingCart className="icon" />
          <div className="user-icon">
        <FaUser className="icon" onClick={handleUserIconClick} />
        {isUserDropdownOpen && (
          <div className="user-dropdown">
            <div
              className="dropdown-item"
              onClick={() => navigate("/edit-account")}
            >
              <FaCog className="dropdown-icon" /> Chỉnh sửa tài khoản
            </div>
            <div
              className="dropdown-item"
              onClick={() => navigate("/order-history")}
            >
              <FaHistory className="dropdown-icon" /> Lịch sử đơn hàng
            </div>
            <div
              className="dropdown-item"
              onClick={() => navigate("/logout")}
            >
              <FaSignOutAlt className="dropdown-icon" /> Đăng xuất
            </div>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Thanh thứ hai */}
      <div className="header-second">
        <div
          className={`menu-item ${selectedItem === "about" ? "active" : ""}`}
          onClick={() => handleSelectItem("about")}
        >
        <Link to="/AboutUs">VỀ CHÚNG TÔI</Link>
        </div>
        <div
          className={`menu-item ${
            selectedItem === "collection" ? "active" : ""
          }`}
          onClick={() => {
            handleSelectItem("collection");
            handleDropdownToggle("collection");
          }}
        >
          BỘ SƯU TẬP
          {dropdownOpen === "collection" && <DropdownMenu />}
        </div>
        <div
          className={`menu-item ${
            selectedItem === "products" ? "active" : ""
          }`}
          onClick={() => {
            handleSelectItem("products");
          }}
        >
          SẢN PHẨM
        </div>
        <div
          className={`menu-item ${selectedItem === "news" ? "active" : ""}`}
          onClick={() => handleSelectItem("news")}
        >
        <Link to="/BlogPage">BLOG TIN TỨC</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
