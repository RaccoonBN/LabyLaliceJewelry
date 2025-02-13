import React, { useState } from "react";
import ProductCard from "../components/productCard";
import Slider from "react-slick"; 
import "./Home.css";

// Import các banner
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import demosp from "../assets/demosp.png"
function Home() {
  const products = [
    {
      id: 1,
      image: demosp,
      collectionName: "Bộ Sưu Tập A",
      productName: "Sản Phẩm 1",
      price: "7000000",
    },
    {
      id: 2,
      image: demosp,
      collectionName: "Bộ Sưu Tập B",
      productName: "Sản Phẩm 2",
      price: "8000000",
    },
    {
      id: 3,
      image: demosp,
      collectionName: "Bộ Sưu Tập C",
      productName: "Sản Phẩm 3",
      price: "9000000",
    },
    {
      id: 4,
      image: demosp,
      collectionName: "Bộ Sưu Tập D",
      productName: "Sản Phẩm 4",
      price: "6000000",
    },
    {
      id: 5,
      image: demosp,
      collectionName: "Bộ Sưu Tập D",
      productName: "Sản Phẩm 5",
      price: "6000000",
    },
    {
      id: 6,
      image: demosp,
      collectionName: "Bộ Sưu Tập E",
      productName: "Sản Phẩm 6",
      price: "10000000",
    },
  ];

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // Mỗi trang hiển thị 4 sản phẩm
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
    dots: true,  // Hiển thị dot navigation
    infinite: true, // Lặp lại vòng quay
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000, // Đặt thời gian tự động chuyển slide
    slidesToShow: 1, // Số lượng slide hiển thị mỗi lần
    slidesToScroll: 1, // Số lượng slide chuyển mỗi lần
  };

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
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              collectionName={product.collectionName}
              productName={product.productName}
              price={product.price}
            />
          ))}
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
