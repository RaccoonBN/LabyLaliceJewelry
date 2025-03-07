import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import demosp from "../assets/demosp.png"; // Ảnh mặc định

const ProductManagement = () => {

  // Trạng thái modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Bộ lọc & Sắp xếp
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Gọi API lấy danh mục & bộ sưu tập
  useEffect(() => {
    axios.get("http://localhost:4000/categories").then((res) => setCategories(res.data));
    axios.get("http://localhost:4000/collections").then((res) => setCollections(res.data));
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/product");
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/product/product/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const openModal = (product = null) => {
    setEditProduct(product);
    setIsModalOpen(true);
    setImagePreview(product?.image ? `http://localhost:4000/product/uploads/${product.image}` : null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", e.target.name.value);
    formData.append("category_id", e.target.category.value);
    formData.append("collection_id", e.target.collection.value);
    formData.append("price", Number(e.target.price.value));
    formData.append("stock", Number(e.target.stock.value));
    formData.append("description", e.target.description.value);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      if (editProduct) {
        await axios.put(`http://localhost:4000/product/product/${editProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:4000/product/product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }

    closeModal();
  };

  const filteredProducts = products
  .filter((product) => {
    // Kiểm tra kiểu dữ liệu trước khi so sánh
    const productCategoryId = Number(product.category_id);  
    const productCollectionId = Number(product.collection_id);
    const selectedCategoryId = categoryFilter ? Number(categoryFilter) : undefined;
    const selectedCollectionId = collectionFilter ? Number(collectionFilter) : undefined;
    

    if (selectedCategoryId !== undefined && productCategoryId !== selectedCategoryId) {
      return false;
    }
    if (selectedCollectionId !== undefined && productCollectionId !== selectedCollectionId) {
      return false;
    }
    

    return true;
  })
  .sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.created_at) - new Date(a.created_at);
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
          {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
        </select>

        <select onChange={(e) => setCollectionFilter(e.target.value)} value={collectionFilter}>
          <option value="">Tất cả bộ sưu tập</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name} 
            </option>
          ))}
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="newest">Mới nhất</option>
          <option value="priceAsc">Giá thấp đến cao</option>
          <option value="priceDesc">Giá cao đến thấp</option>
        </select>
      </div>


           {/* Danh sách sản phẩm */}
           <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
            src={product.image ? product.image : demosp}
            alt={product.name}
            className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">
            {product.category_name} - {product.collection_name}
           </p>
            <p className="product-price">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(product.price))}
          </p>
            <p className="product-stock">Số lượng: {product.stock}</p>
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
              <input
                type="text"
                name="name"
                placeholder="Tên sản phẩm"
                defaultValue={editProduct?.name || ""}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Giá tiền"
                defaultValue={editProduct?.price || ""}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Số lượng tồn kho"
                defaultValue={editProduct?.stock || ""}
                required
              />
              <textarea
                name="description"
                placeholder="Mô tả sản phẩm"
                defaultValue={editProduct?.description || ""}
                required
              ></textarea>

              <select name="category" defaultValue={editProduct?.category_id || ""} required>
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select name="collection" defaultValue={editProduct?.collection_id || ""} required>
                <option value="">Chọn bộ sưu tập</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>


              {/* Hiển thị ảnh preview */}
              {imagePreview && (
                <img src={imagePreview} alt="Ảnh sản phẩm" className="image-preview" />
              )}

              {/* Upload ảnh */}
              <input type="file" name="image" accept="image/*" onChange={handleImageChange} />

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
