import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import "./App.css"; 
import UserManagement from "./pages/user";
import BlogManagement from "./pages/blog";
import OrderManagement from "./pages/order";
import CategoryManagement from "./pages/category";
import CollectionManagement from "./pages/collection";
import ProductManagement from "./pages/product";
function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/blog" element={<BlogManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/collections" element={<CollectionManagement />} />
            <Route path="/products" element={<ProductManagement />} />

            {/* Thêm các trang quản lý khác */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
