import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetail.css";

const ProductDetail = ({ product }) => {
  if (!product) return <div>Không có dữ liệu sản phẩm</div>;

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  // ✅ Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      const userId = 3; // 🔹 Thay bằng userId từ session hoặc state
      const response = await axios.post("http://localhost:2000/cart/add", {
        userId,
        productId: product.id,
        quantity: 1, // Mặc định thêm 1 sản phẩm
      });

      toast.success(`🛒 ${product.name} đã được thêm vào giỏ hàng!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("❌ Lỗi khi thêm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="product-detail-container">
      {/* Hình ảnh sản phẩm */}
      <div className="product-detail-image">
        <img 
          src={product.image ? `http://localhost:4000/uploads/${product.image}` : "/default-image.jpg"} 
          alt={product.name} 
          onError={(e) => (e.target.src = "/default-image.jpg")}
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-detail-info">
        <h1 className="product-detail-title">{product.name}</h1>
        <p className="product-detail-price">{formattedPrice}</p>
        <p className="product-detail-description">{product.description}</p>

        {/* Hiển thị tồn kho */}
        <p className="product-stock">📦 Số lượng còn: {product.stock}</p>

        {/* Hiển thị đánh giá */}
        <div className="product-rating">
          <p>⭐ {product.avg_rating.toFixed(1)} / 5 ({product.review_count} đánh giá)</p>
        </div>

        {/* Nút mua hàng */}
        <div className="product-detail-actions">
          <button className="product-detail-add-to-cart" onClick={handleAddToCart}>🛒 Thêm vào giỏ hàng</button>
          <button className="product-detail-buy-now">⚡ Mua ngay</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
