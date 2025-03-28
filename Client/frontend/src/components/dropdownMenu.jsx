import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dropdownMenu.css";

const DropdownMenu = () => {
    const [collections, setCollections] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:2000/collections")
            .then(response => {
                setCollections(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách bộ sưu tập:", error);
            });
    }, []);

    const handleCollectionClick = (collectionId) => {
        navigate(`/all-products?collection=${collectionId}`);
    };

    return (
        <ul className="dropdown-menu">
            {collections.map((collection) => (
                <li key={collection.id} className="dropdown-item" onClick={() => handleCollectionClick(collection.id)}>
                    <span className="dropdown-title">{collection.name}</span>
                </li>
            ))}
        </ul>
    );
};

export default DropdownMenu;
