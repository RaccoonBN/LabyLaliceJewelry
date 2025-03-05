import React, { useState } from "react";
import "./collection.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const CollectionManagement = () => {
  const [collections, setCollections] = useState([
    { id: 1, name: "Mùa Hè Rực Rỡ", itemCount: 12, description: "Bộ sưu tập mùa hè đầy màu sắc" },
    { id: 2, name: "Tinh Tế và Sang Trọng", itemCount: 8, description: "Phong cách thanh lịch, hiện đại" },
    { id: 3, name: "Bộ Sưu Tập Cưới", itemCount: 15, description: "Những bộ trang phục cưới đẹp nhất" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

  const openModal = (collection = null) => {
    setIsEditing(!!collection);
    setSelectedCollection(collection);
    setCollectionName(collection ? collection.name : "");
    setCollectionDescription(collection ? collection.description : "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCollection(null);
    setCollectionName("");
    setCollectionDescription("");
  };

  const saveCollection = () => {
    if (collectionName.trim() === "") return;

    if (isEditing) {
      setCollections(
        collections.map((col) =>
          col.id === selectedCollection.id
            ? { ...col, name: collectionName, description: collectionDescription }
            : col
        )
      );
    } else {
      const newId = collections.length ? collections[collections.length - 1].id + 1 : 1;
      setCollections([...collections, { id: newId, name: collectionName, itemCount: 0, description: collectionDescription }]);
    }

    closeModal();
  };

  const deleteCollection = (id) => {
    setCollections(collections.filter((col) => col.id !== id));
  };

  return (
    <div className="collection-container">
      <h2 className="collection-title">Quản lý Bộ Sưu Tập</h2>
      <div className="add-collection">
        <button className="add-button" onClick={() => openModal()}>
          <FaPlus /> Thêm Bộ Sưu Tập
        </button>
      </div>
      <table className="collection-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Bộ Sưu Tập</th>
            <th>Mô Tả</th>
            <th>Số Sản Phẩm</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection.id}>
              <td>{collection.id}</td>
              <td>{collection.name}</td>
              <td>{collection.description}</td>
              <td>{collection.itemCount}</td>
              <td>
                <button className="icon-button edit-button" onClick={() => openModal(collection)}>
                  <FaEdit />
                </button>
                <button className="icon-button delete-button" onClick={() => deleteCollection(collection.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? "Chỉnh sửa bộ sưu tập" : "Thêm bộ sưu tập mới"}</h3>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Nhập tên bộ sưu tập..."
            />
            <textarea
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              placeholder="Nhập mô tả bộ sưu tập..."
            />
            <div className="modal-actions">
              <button className="save-button" onClick={saveCollection}>
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

export default CollectionManagement;
