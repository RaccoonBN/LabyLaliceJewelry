import React, { useState, useEffect } from "react";
import ProductCard from "../components/productCard";
import Slider from "react-slick";
import axios from "axios"; // Import axios để gọi API
import "./Home.css";

// Import các banner
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";

function Home() {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi (nếu có)

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // Mỗi trang hiển thị 20 sản phẩm
  const totalPages = Math.ceil(products.length / productsPerPage);

  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Cấu hình slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Lấy sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:2000/products");
        console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu trả về
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu sản phẩm.");
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <main className="home-content">
        {/* Slide Banner */}
        <div className="banner-slider">
          <Slider {...settings}>
            <div>
              <img src={banner1} alt="Banner 1" />
            </div>
            <div>
              <img src={banner2} alt="Banner 2" />
            </div>
            <div>
              <img src={banner3} alt="Banner 3" />
            </div>
          </Slider>
        </div>

        {/* Tiêu đề sản phẩm mới */}
        <h2>Sản Phẩm Mới</h2>
        <p>Khám phá những sản phẩm mới nhất của chúng tôi!</p>

        {/* Hiển thị sản phẩm */}
        <div className="new-products">
        {displayedProducts.map((product) => {
        const imageUrl = product.image.includes("http")
          ? product.image
          : `http://localhost:4000/uploads/${product.image}`;

        console.log("URL ảnh đúng:", imageUrl); // Kiểm tra URL

        return (
          <ProductCard
          id={product.id} // 🔥 Thêm id vào đây
            key={product.id}
            image={imageUrl}
            collectionName={product.category_name || "Bộ sưu tập chưa có"}
            productName={product.name || "Tên sản phẩm không có"}
            price={product.price || "Chưa có giá"}
          />
        );
      })}

        </div>

        {/* Phân trang */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? "active" : ""}
              >
                {page}
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
