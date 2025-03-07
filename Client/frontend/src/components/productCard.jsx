import React from "react";
import { useNavigate } from "react-router-dom";
import "./productCard.css";

function ProductCard({ id, image, collectionName, productName, price }) {
  const navigate = useNavigate();

  // Định dạng giá
  const formattedPrice = price ? Number(price).toLocaleString("vi-VN") + " VND" : "Liên hệ";

  // Xử lý sự kiện khi click vào sản phẩm
  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <img
        src={image ? image : "/default-image.jpg"} // Nếu không có ảnh, dùng ảnh mặc định
        alt={productName || "Sản phẩm không có tên"}
        className="product-image"
      />
      <p className="collection-name">{collectionName || "Bộ sưu tập chưa có"}</p>
      <p className="product-name">{productName || "Tên sản phẩm không có"}</p>
      <p className="product-price">{formattedPrice}</p>
    </div>
  );
}

export default ProductCard;
