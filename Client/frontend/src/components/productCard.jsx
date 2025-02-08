import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./productCard.css";

function ProductCard({ id, image, collectionName, productName, price }) {
  const navigate = useNavigate(); // Hook để điều hướng

  // Định dạng giá theo tiền tệ Việt Nam
  const formattedPrice = Number(price).toLocaleString("vi-VN") + " VND";

  // Xử lý sự kiện click vào sản phẩm
  const handleClick = () => {
    navigate(`/product/${id}`); // Điều hướng đến trang chi tiết sản phẩm
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <img src={image} alt={productName} className="product-image" />
      <p className="collection-name">{collectionName}</p>
      <p className="product-name">{productName}</p>
      <p className="product-price">{formattedPrice}</p>
    </div>
  );
}

export default ProductCard;
