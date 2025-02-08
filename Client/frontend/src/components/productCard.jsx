import React from "react";
import "./productCard.css";

function ProductCard({ image, collectionName, productName, price }) {
  // Định dạng giá theo tiền tệ Việt Nam
  const formattedPrice = Number(price).toLocaleString("vi-VN") + " VND";

  return (
    <div className="product-card">
      <img src={image} alt={productName} className="product-image" />
      <p className="collection-name">{collectionName}</p>
      <p className="product-name">{productName}</p>
      <p className="product-price">{formattedPrice}</p>
    </div>
  );
}

export default ProductCard;
