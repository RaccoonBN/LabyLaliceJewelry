import React from "react";
import { useNavigate } from "react-router-dom";
import "./productCard.css";

function ProductCard({ id, image, collectionName, productName, price }) {
  const navigate = useNavigate();

  // Định dạng giá
  const formattedPrice = price ? Number(price).toLocaleString("vi-VN") + " VND" : "Liên hệ";

  // Xử lý khi click vào sản phẩm
  const handleClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      console.error("ID sản phẩm không hợp lệ:", id);
    }
  };

  return (
    <div className="product-card" onClick={handleClick} style={{ cursor: id ? "pointer" : "default" }}>
      <img
        src={image && image.startsWith("http") ? image : "/default-image.jpg"} // Kiểm tra đường dẫn ảnh hợp lệ
        alt={productName || "Sản phẩm không có tên"}
        className="product-image"
        onError={(e) => (e.target.src = "/default-image.jpg")} // Nếu lỗi, hiển thị ảnh mặc định
      />
      <p className="collection-name">{collectionName || "Bộ sưu tập chưa có"}</p>
      <p className="product-name">{productName || "Tên sản phẩm không có"}</p>
      <p className="product-price">{formattedPrice}</p>
    </div>
  );
}

export default ProductCard;
