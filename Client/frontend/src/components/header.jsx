import React, { useState } from 'react';
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa'; // Import icon user
import './header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);  // Cập nhật mục đang chọn
    setDropdownOpen(null);   // Đóng dropdown khi chọn mục
  };

  const handleDropdownToggle = (item) => {
    setDropdownOpen(dropdownOpen === item ? null : item);  // Toggle mở/đóng dropdown
  };

  return (
    <header>
      {/* Thanh đầu tiên */}
      <div className="header-first">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Tìm kiếm" />
        </div>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="icons">
          <FaHeart className="icon" />
          <FaShoppingCart className="icon" />
          <FaUser className="icon" />  {/* Đảm bảo rằng icon người dùng có mặt ở đây */}
        </div>
      </div>

      {/* Thanh thứ hai */}
      <div className="header-second">
        <div
          className={`menu-item ${selectedItem === 'about' ? 'active' : ''}`}
          onClick={() => handleSelectItem('about')}
        >
          VỀ CHÚNG TÔI
        </div>
        <div
          className={`menu-item ${selectedItem === 'collection' ? 'active' : ''}`}
          onClick={() => {
            handleSelectItem('collection');
            handleDropdownToggle('collection');
          }}
        >
          BỘ SƯU TẬP
          {dropdownOpen === 'collection' && (
            <div className="dropdown">
              <div className="dropdown-item">Sản phẩm 1</div>
              <div className="dropdown-item">Sản phẩm 2</div>
              <div className="dropdown-item">Sản phẩm 3</div>
            </div>
          )}
        </div>
        <div
          className={`menu-item ${selectedItem === 'products' ? 'active' : ''}`}
          onClick={() => {
            handleSelectItem('products');
            handleDropdownToggle('products');
          }}
        >
          SẢN PHẨM
          {dropdownOpen === 'products' && (
            <div className="dropdown">
              <div className="dropdown-item">Sản phẩm A</div>
              <div className="dropdown-item">Sản phẩm B</div>
              <div className="dropdown-item">Sản phẩm C</div>
            </div>
          )}
        </div>
        <div
          className={`menu-item ${selectedItem === 'news' ? 'active' : ''}`}
          onClick={() => handleSelectItem('news')}
        >
          BLOG TIN TỨC
        </div>
      </div>
    </header>
  );
};

export default Header;
