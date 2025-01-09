import React from "react";
import "./productCard.css";

function ProductCard({ image, collectionName, productName, price }) {
  return (
    <div className="product-card">
      <img src={image} alt={productName} className="product-image" />
      <p className="collection-name">{collectionName}</p>
      <p className="product-name">{productName}</p>
      <p className="product-price">{price} VND</p>
    </div>
  );
}

export default ProductCard;
