import React, { useState, useEffect } from "react";
import axios from "axios";
import "./collection.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CollectionManagement = () => {
    const [collections, setCollections] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collectionName, setCollectionName] = useState("");
    const [collectionDescription, setCollectionDescription] = useState("");

    // Lấy danh sách bộ sưu tập từ API
    useEffect(() => {
        axios.get("http://localhost:4000/collections")
            .then((response) => {
                setCollections(response.data);
            })
            .catch(() => {
                toast.error("Lỗi khi tải danh sách bộ sưu tập.", { position: "top-right" });
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
        if (collectionName.trim() === "") {
            toast.warn("Vui lòng nhập tên bộ sưu tập.", { position: "top-right" });
            return;
        }

        if (isEditing) {
            axios.put(`http://localhost:4000/collections/${selectedCollection.id}`, {
                name: collectionName,
                description: collectionDescription,
            })
                .then(() => {
                    setCollections(collections.map((col) =>
                        col.id === selectedCollection.id
                            ? { ...col, name: collectionName, description: collectionDescription }
                            : col
                    ));
                    closeModal();
                    toast.success("Cập nhật bộ sưu tập thành công!", { position: "top-right" });
                })
                .catch(() => {
                    toast.error("Lỗi khi cập nhật bộ sưu tập.", { position: "top-right" });
                });
        } else {
            axios.post("http://localhost:4000/collections", {
                name: collectionName,
                description: collectionDescription,
            })
                .then((response) => {
                    setCollections([...collections, response.data]);
                    closeModal();
                    toast.success("Thêm bộ sưu tập thành công!", { position: "top-right" });
                })
                .catch(() => {
                    toast.error("Lỗi khi thêm bộ sưu tập.", { position: "top-right" });
                });
        }
    };

    const deleteCollection = (id) => {
        axios.delete(`http://localhost:4000/collections/${id}`)
            .then(() => {
                setCollections(collections.filter((col) => col.id !== id));
                toast.success("Xóa bộ sưu tập thành công!", { position: "top-right" });
            })
            .catch(() => {
                toast.error("Lỗi khi xóa bộ sưu tập.", { position: "top-right" });
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
                        <th>Số lượng sản phẩm</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {collections.map((collection) => (
                        <tr key={collection.id}>
                            <td>{collection.id}</td>
                            <td>{collection.name}</td>
                            <td>{collection.description}</td>
                            <td>{collection.product_count}</td> {/* Hiển thị số lượng sản phẩm */}
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
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default CollectionManagement;