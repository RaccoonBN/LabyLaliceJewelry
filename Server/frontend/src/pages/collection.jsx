import React, { useState, useEffect } from "react";
import axios from "axios";
import "./collection.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

  // Lấy danh sách bộ sưu tập từ API
  useEffect(() => {
    axios.get("http://localhost:4000/collections").then((response) => {
      setCollections(response.data);
    });
  }, []);

  const openModal = (collection = null) => {
    setIsEditing(!!collection);
    setSelectedCollection(collection);
    setCollectionName(collection ? collection.name : "");
    setCollectionDescription(collection ? collection.description : "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCollectionName("");
    setCollectionDescription("");
  };

  const saveCollection = () => {
    if (collectionName.trim() === "") return;

    if (isEditing) {
      axios.put(`http://localhost:4000/collections/${selectedCollection.id}`, {
        name: collectionName,
        description: collectionDescription,
      }).then(() => {
        setCollections(collections.map((col) =>
          col.id === selectedCollection.id
            ? { ...col, name: collectionName, description: collectionDescription }
            : col
        ));
        closeModal();
      });
    } else {
      axios.post("http://localhost:4000/collections", {
        name: collectionName,
        description: collectionDescription,
      }).then((response) => {
        setCollections([...collections, response.data]);
        closeModal();
      });
    }
  };

  const deleteCollection = (id) => {
    axios.delete(`http://localhost:4000/collections/${id}`).then(() => {
      setCollections(collections.filter((col) => col.id !== id));
    });
  };

  return (
    <div className="collection-container">
      <h2 className="collection-title">Quản lý Bộ Sưu Tập</h2>
      <button className="add-button" onClick={() => openModal()}>
        <FaPlus /> Thêm Bộ Sưu Tập
      </button>
      <table className="collection-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Bộ Sưu Tập</th>
            <th>Mô Tả</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection.id}>
              <td>{collection.id}</td>
              <td>{collection.name}</td>
              <td>{collection.description}</td>
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
