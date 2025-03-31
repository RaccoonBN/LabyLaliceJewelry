import React, { useState, useEffect } from "react";
import "./category.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:4000/categories";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Lấy danh mục từ backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      toast.error("Lỗi khi lấy danh sách danh mục.", { position: "top-right" });
    }
  };

  // Mở modal
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

  // Lưu danh mục (Thêm/Sửa)
  const saveCategory = async () => {
    if (categoryName.trim() === "") {
      toast.warn("Vui lòng nhập tên danh mục.", { position: "top-right" });
      return;
    }

    try {
      if (isEditing) {
        await fetch(`${API_URL}/${selectedCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
        toast.success("Cập nhật danh mục thành công!", { position: "top-right" });
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
        const data = await response.json(); // Get data for successful creation
        setCategories([...categories, data]); // Add new data
        toast.success("Thêm danh mục thành công!", { position: "top-right" });
      }

      fetchCategories(); // Cập nhật lại danh sách sau khi lưu
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      toast.error("Lỗi khi lưu danh mục.", { position: "top-right" });
    }
  };

  // Xóa danh mục
  const deleteCategory = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setCategories(categories.filter((category) => category.id !== id));
      toast.success("Xóa danh mục thành công!", { position: "top-right" });
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Lỗi khi xóa danh mục.", { position: "top-right" });
    }
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
            <th>Số lượng sản phẩm</th> {/* Thêm cột số lượng sản phẩm */}
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.product_count || 0}</td> {/* Hiển thị số lượng sản phẩm */}
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
       <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default CategoryManagement;