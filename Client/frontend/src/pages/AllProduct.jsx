import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllProduct.css";
import ProductCard from "../components/productCard";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const productsPerPage = 20;

  // Gọi API lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:2000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Gọi API lấy danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:2000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục sản phẩm:", error);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý khi thay đổi bộ lọc
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Lọc sản phẩm theo danh mục và giá
  const filteredProducts = products.filter((product) => {
    console.log("Product:", product); // Log sản phẩm để kiểm tra dữ liệu đầu vào
    console.log("Product Category ID:", product.category_id, "Selected Category:", category);
  
    const categoryMatch =
      category === "all" || parseInt(product.category_id) === parseInt(category);
    
    console.log("Category Match:", categoryMatch);
  
    console.log("Product Price:", product.price, "Selected Price Range:", priceRange);
  
    const priceMatch =
      priceRange === "all" ||
      (priceRange === "low" && parseInt(product.price) <= 3000000) ||
      (priceRange === "medium" && parseInt(product.price) > 3000000 && parseInt(product.price) <= 7000000) ||
      (priceRange === "high" && parseInt(product.price) > 7000000);
  
    console.log("Price Match:", priceMatch);
  
    return categoryMatch && priceMatch;
  });
  

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Lấy sản phẩm theo trang
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
          <select value={category} onChange={handleCategoryChange}>
            <option value="all">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Khoảng giá:</span>
          <select value={priceRange} onChange={handlePriceChange}>
            <option value="all">Tất cả</option>
            <option value="low">Dưới 3 triệu</option>
            <option value="medium">3 - 7 triệu</option>
            <option value="high">Trên 7 triệu</option>
          </select>
        </label>
      </div>

      {/* Hiển thị sản phẩm */}
      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="all-products">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                collectionName={product.collection_name}
                productName={product.name}
                price={product.price}
              />
            ))
          ) : (
            <p>Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      )}

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
