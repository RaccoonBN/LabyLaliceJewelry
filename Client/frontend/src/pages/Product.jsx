import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";
import ReviewSection from "../components/Review";
import "./Product.css";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  console.log("ID từ URL:", id); // Kiểm tra ID lấy được từ URL

  const [product, setProduct] = useState(null); // Sản phẩm
  const [relatedProducts, setRelatedProducts] = useState([]); // Sản phẩm liên quan
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi (nếu có)

  useEffect(() => {
    // Gọi API để lấy sản phẩm theo ID, danh mục và bộ sưu tập
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/products/${id}`);
        console.log("Dữ liệu từ API:", response.data); // Debug dữ liệu nhận được từ API
        setProduct(response.data.product);
        setRelatedProducts(response.data.relatedProducts || []); // Đảm bảo mảng sản phẩm liên quan không phải là undefined
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu sản phẩm.");
      } finally {
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
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className="related-product-card">
                <img
                  src={item.image ? `http://localhost:4000/uploads/${item.image}` : "/default-image.jpg"} // Đảm bảo lấy đúng đường dẫn ảnh
                  alt={item.name || "Sản phẩm không có tên"}
                  onError={(e) => {
                    // Kiểm tra nếu lỗi thì thay đổi src một lần nữa
                    if (e.target.src !== "/default-image.jpg") {
                      e.target.src = "/default-image.jpg";
                    }
                  }}
                />
                <p className="related-product-title">{item.name || "Không có tên"}</p>
                <p className="related-price">
                {item.price ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price) : "Liên hệ"}
                </p>
              </Link>
            ))
          ) : (
            <p>Không có sản phẩm liên quan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
