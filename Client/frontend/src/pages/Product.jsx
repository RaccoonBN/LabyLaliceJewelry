import React from "react";
import { Link, useParams } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";
import ReviewSection from "../components/Review";
import "./Product.css";
import demosp from "../assets/demosp.png";

// Danh sách sản phẩm
const products = [
  { id: 1, image: demosp, title: "Nhẫn Kim Cương", price: 5000000, description: "Chiếc nhẫn kim cương sang trọng, phù hợp với các sự kiện quan trọng." },
  { id: 2, image: "necklace.jpg", title: "Dây Chuyền Vàng", price: 7000000, description: "Dây chuyền vàng 18K cao cấp, sang trọng và quý phái." },
  { id: 3, image: "earring.jpg", title: "Bông Tai Bạc", price: 2000000, description: "Bông tai bạc 925 thanh lịch, phù hợp với mọi phong cách." },
  { id: 4, image: "ring.jpg", title: "Nhẫn Vàng", price: 4000000, description: "Nhẫn vàng 14K sang trọng, biểu tượng của tình yêu vĩnh cửu." },
];

const ProductPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const productId = parseInt(id) || 1; // Chuyển ID từ string sang số
  const product = products.find((p) => p.id === productId) || products[0]; // Tìm sản phẩm theo ID
  const relatedProducts = products.filter((p) => p.id !== productId); // Lọc sản phẩm liên quan

  return (
    <div>
      {/* Thông tin chi tiết sản phẩm */}
      <ProductDetail product={product} />

      {/* Phần đánh giá & bình luận */}
      <ReviewSection />

        {/* Sản phẩm liên quan */}
        <div className="related-products">
        <h2>Sản phẩm liên quan</h2>
        <div className="product-list">
            {relatedProducts.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="related-product-card">
                <img src={item.image} alt={item.title} />
                <p className="related-product-title">{item.title}</p>
                <p className="related-price">{item.price.toLocaleString()} VND</p>
            </Link>
            ))}

        </div>
      </div>
    </div>
  );
};

export default ProductPage;
