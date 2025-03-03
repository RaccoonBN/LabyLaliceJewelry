import React, { useState } from "react";
import "./product.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import demosp from "../assets/demosp.png"; // Ảnh mặc định

const ProductManagement = () => {
  // Danh sách sản phẩm giả lập
  const [products, setProducts] = useState(Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Sản phẩm ${i + 1}`,
    collection: i % 2 === 0 ? "Luxury" : "Classic",
    category: i % 2 === 0 ? "Nhẫn" : "Dây chuyền",
    price: Math.floor(Math.random() * 10000000) + 5000000,
    image: demosp,
    description: `Mô tả sản phẩm ${i + 1}`,
    createdAt: new Date().getTime() - i * 1000000, // Giả lập thời gian tạo
  })));

  // Trạng thái modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Bộ lọc & Sắp xếp
  const [categoryFilter, setCategoryFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Mở modal (thêm hoặc sửa)
  const openModal = (product = null) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Lưu sản phẩm (Thêm hoặc sửa)
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("image");

    const newProduct = {
      id: editProduct ? editProduct.id : Date.now(),
      name: formData.get("name"),
      category: formData.get("category"),
      collection: formData.get("collection"),
      price: Number(formData.get("price")),
      description: formData.get("description"),
      image: file && file.size > 0 ? URL.createObjectURL(file) : editProduct?.image || demosp,
      createdAt: editProduct ? editProduct.createdAt : new Date().getTime(),
    };

    if (editProduct) {
      setProducts(products.map((p) => (p.id === editProduct.id ? newProduct : p)));
    } else {
      setProducts([...products, newProduct]);
    }
    closeModal();
  };

  // Lọc & Sắp xếp sản phẩm
  const filteredProducts = products
    .filter((product) => (categoryFilter ? product.category === categoryFilter : true))
    .filter((product) => (collectionFilter ? product.collection === collectionFilter : true))
    .sort((a, b) => {
      if (sortOrder === "newest") return b.createdAt - a.createdAt;
      if (sortOrder === "priceAsc") return a.price - b.price;
      if (sortOrder === "priceDesc") return b.price - a.price;
      return 0;
    });

  // Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="product-container">
      <h2 className="product-title">Quản Lý Sản Phẩm</h2>
      <button className="add-button" onClick={() => openModal()}>
        <FaPlus /> Thêm Sản Phẩm
      </button>

      {/* Bộ lọc & Sắp xếp */}
      <div className="filters">
        <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
          <option value="">Tất cả danh mục</option>
          <option value="Nhẫn">Nhẫn</option>
          <option value="Dây chuyền">Dây chuyền</option>
        </select>

        <select onChange={(e) => setCollectionFilter(e.target.value)} value={collectionFilter}>
          <option value="">Tất cả bộ sưu tập</option>
          <option value="Luxury">Luxury</option>
          <option value="Classic">Classic</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="newest">Mới nhất</option>
          <option value="priceAsc">Giá thấp đến cao</option>
          <option value="priceDesc">Giá cao đến thấp</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="product-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category} - {product.collection}</p>
            <p className="product-price">{product.price.toLocaleString("vi-VN")} VND</p>
            <div className="product-actions">
              <button className="edit-button" onClick={() => openModal(product)}><FaEdit /></button>
              <button className="delete-button" onClick={() => handleDelete(product.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}</h3>
            <form onSubmit={handleSave}>
              <input type="text" name="name" placeholder="Tên sản phẩm" defaultValue={editProduct?.name || ""} required />
              <input type="number" name="price" placeholder="Giá tiền" defaultValue={editProduct?.price || ""} required />
              <select name="category" defaultValue={editProduct?.category || ""} required>
                <option value="">Chọn danh mục</option>
                <option value="Nhẫn">Nhẫn</option>
                <option value="Dây chuyền">Dây chuyền</option>
              </select>
              
              <select name="collection" defaultValue={editProduct?.collection || ""} required>
                <option value="">Chọn bộ sưu tập</option>
                <option value="Luxury">Luxury</option>
                <option value="Classic">Classic</option>
              </select>
              
              <input type="file" name="image" accept="image/*" />
              <div className="modal-actions">
                <button type="submit" className="save-button">Lưu</button>
                <button type="button" className="close-button" onClick={closeModal}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
