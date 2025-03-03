import React, { useState } from "react";
import "./category.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Nhẫn", productCount: 10 },
    { id: 2, name: "Dây chuyền", productCount: 15 },
    { id: 3, name: "Bông tai", productCount: 8 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Mở modal cho thêm/sửa
  const openModal = (category = null) => {
    setIsEditing(!!category);
    setSelectedCategory(category);
    setCategoryName(category ? category.name : "");
    setModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    setCategoryName("");
  };

  // Lưu danh mục (thêm/sửa)
  const saveCategory = () => {
    if (categoryName.trim() === "") return;

    if (isEditing) {
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, name: categoryName } : cat
        )
      );
    } else {
      const newId = categories.length ? categories[categories.length - 1].id + 1 : 1;
      setCategories([...categories, { id: newId, name: categoryName, productCount: 0 }]);
    }

    closeModal();
  };

  // Xóa danh mục
  const deleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="category-container">
      <h2 className="category-title">Quản lý Danh Mục Sản Phẩm</h2>

      {/* Thêm danh mục */}
      <div className="add-category">
        <button className="add-button" onClick={() => openModal()}>
          <FaPlus /> Thêm Danh Mục
        </button>
      </div>

      {/* Danh sách danh mục */}
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Danh Mục</th>
            <th>Số Lượng Sản Phẩm</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.productCount}</td>
              <td>
                <button className="icon-button edit-button" onClick={() => openModal(category)}>
                  <FaEdit />
                </button>
                <button className="icon-button delete-button" onClick={() => deleteCategory(category.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm/sửa danh mục */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h3>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục..."
            />
            <div className="modal-actions">
              <button className="save-button" onClick={saveCategory}>
                Lưu
              </button>
              <button className="close-button" onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
