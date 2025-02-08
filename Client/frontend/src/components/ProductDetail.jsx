import React from "react";
import "./ProductDetail.css";

const ProductDetail = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  return (
    <div className="product-detail-container">
      {/* Hình ảnh sản phẩm */}
      <div className="product-detail-image">
        <img src={product.image} alt={product.title} />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-detail-info">
        <h1 className="product-detail-title">{product.title}</h1>
        <p className="product-detail-price">{formattedPrice}</p>
        <p className="product-detail-description">{product.description}</p>

        {/* Nút mua hàng */}
        <div className="product-detail-actions">
          <button className="product-detail-add-to-cart">🛒 Thêm vào giỏ hàng</button>
          <button className="product-detail-buy-now">⚡ Mua ngay</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
