import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetail.css";

const ProductDetail = ({ product }) => {
  const [userId, setUserId] = useState(null);
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Chưa có token!");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:2000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data?.id && response.data?.fullname) {
          setUserId(response.data.id);
          setFullname(response.data.fullname);
        } else {
          console.error("Không lấy được thông tin user");
        }
      })
      .catch((error) => console.error("Lỗi khi lấy profile:", error))
      .finally(() => setLoading(false));
  }, []);

  if (!product) return <div>Không có dữ liệu sản phẩm</div>;

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      await axios.post("http://localhost:2000/cart/add", {
        userId,
        productId: product.id,
        quantity: 1,
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
      <div className="product-detail-image">
        <img
          src={product.image ? `http://localhost:4000/uploads/${product.image}` : "/default-image.jpg"}
          alt={product.name}
          onError={(e) => (e.target.src = "/default-image.jpg")}
        />
      </div>

      <div className="product-detail-info">
        <h1 className="product-detail-title">{product.name}</h1>
        <p className="product-detail-price">{formattedPrice}</p>
        <p className="product-detail-description">{product.description}</p>
        <p className="product-stock">📦 Số lượng còn: {product.stock}</p>
        <div className="product-rating">
          <p>⭐ {product.avg_rating.toFixed(1)} / 5 ({product.review_count} đánh giá)</p>
        </div>
        <div className="product-detail-actions">
          <button className="product-detail-add-to-cart" onClick={handleAddToCart}>🛒 Thêm vào giỏ hàng</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;