import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";
import ReviewSection from "../components/Review";
import "./Product.css";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState(null); // Sản phẩm
  const [relatedProducts, setRelatedProducts] = useState([]); // Sản phẩm liên quan
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi (nếu có)

  useEffect(() => {
    // Gọi API để lấy sản phẩm theo ID và sản phẩm liên quan
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data.product);
        setRelatedProducts(response.data.relatedProducts);
        setLoading(false);
      } catch (error) {
        setError("Có lỗi xảy ra khi tải dữ liệu sản phẩm.");
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Thông tin chi tiết sản phẩm */}
      {product && <ProductDetail product={product} />}

      {/* Phần đánh giá & bình luận */}
      <ReviewSection />

      {/* Sản phẩm liên quan */}
      <div className="related-products">
        <h2>Sản phẩm liên quan</h2>
        <div className="product-list">
          {relatedProducts.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="related-product-card">
              <img src={item.image} alt={item.name} />
              <p className="related-product-title">{item.name}</p>
              <p className="related-price">{item.price.toLocaleString()} VND</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
