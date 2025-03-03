import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { FaBars, FaTimes, FaUsers, FaNewspaper, FaShoppingCart, FaList, FaGem, FaHome, FaBoxOpen } from "react-icons/fa";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        {isOpen && <h2 className="sidebar-title">Jewelry Admin</h2>}
      </div>

      <nav>
        <ul>
          <li>
            <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
              <FaHome className="icon" />
              {isOpen && "Trang chủ"}
            </Link>
          </li>
          <li>
            <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
              <FaUsers className="icon" />
              {isOpen && "Quản lý người dùng"}
            </Link>
          </li>
          <li>
            <Link to="/blog" className={location.pathname === "/blog" ? "active" : ""}>
              <FaNewspaper className="icon" />
              {isOpen && "Quản lý blog"}
            </Link>
          </li>
          <li>
            <Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>
              <FaShoppingCart className="icon" />
              {isOpen && "Quản lý đơn hàng"}
            </Link>
          </li>
          <li>
            <Link to="/categories" className={location.pathname === "/categories" ? "active" : ""}>
              <FaList className="icon" />
              {isOpen && "Quản lý danh mục"}
            </Link>
          </li>
          <li>
            <Link to="/collections" className={location.pathname === "/collections" ? "active" : ""}>
              <FaGem className="icon" />
              {isOpen && "Quản lý bộ sưu tập"}
            </Link>
          </li>
          <li>
            <Link to="/products" className={location.pathname === "/products" ? "active" : ""}>
              <FaBoxOpen className="icon" />
              {isOpen && "Quản lý sản phẩm"}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
