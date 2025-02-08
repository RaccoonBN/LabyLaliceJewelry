import React, { useState } from "react";
import "./AllProduct.css";
import ProductCard from "../components/productCard";

// Danh sách sản phẩm giả định
const allProducts = [
  { id: 1, image: "ring.jpg", collectionName: "Luxury", productName: "Nhẫn Kim Cương", price: 5000000, category: "nhẫn" },
  { id: 2, image: "necklace.jpg", collectionName: "Gold", productName: "Dây Chuyền Vàng", price: 7000000, category: "dây chuyền" },
  { id: 3, image: "earring.jpg", collectionName: "Silver", productName: "Bông Tai Bạc", price: 2000000, category: "bông tai" },
  { id: 4, image: "ring.jpg", collectionName: "Luxury", productName: "Nhẫn Vàng", price: 4000000, category: "nhẫn" },
  { id: 5, image: "necklace.jpg", collectionName: "Gold", productName: "Dây Chuyền Kim Cương", price: 9000000, category: "dây chuyền" }
];

const AllProduct = () => {
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Lọc sản phẩm theo loại và giá
  const filteredProducts = allProducts.filter((product) => {
    return (
      (category === "all" || product.category === category) &&
      (priceRange === "all" ||
        (priceRange === "low" && product.price <= 3000000) ||
        (priceRange === "medium" && product.price > 3000000 && product.price <= 7000000) ||
        (priceRange === "high" && product.price > 7000000))
    );
  });

  // Tính tổng số trang sau khi lọc
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Cắt danh sách sản phẩm theo trang
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Xử lý thay đổi trang
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="all-products-container">
      {/* Bộ lọc */}
      <div className="filter-section">
        <label>
          <span>Loại sản phẩm:</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="nhẫn">Nhẫn</option>
            <option value="dây chuyền">Dây chuyền</option>
            <option value="bông tai">Bông tai</option>
          </select>
        </label>

        <label>
          <span>Khoảng giá:</span>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="low">Dưới 3 triệu</option>
            <option value="medium">3 - 7 triệu</option>
            <option value="high">Trên 7 triệu</option>
          </select>
        </label>
      </div>

      {/* Hiển thị sản phẩm */}
      <div className="all-products">
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
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? "active" : ""}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
