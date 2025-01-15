import React from "react";
import "./dropdownMenu.css";

const DropdownMenu = () => {
    const menuItems = [
        { title: "Hình ảnh 1", image: "https://via.placeholder.com/200x100" },
        { title: "Hình ảnh 2", image: "https://via.placeholder.com/200x100" },
        { title: "Hình ảnh 3", image: "https://via.placeholder.com/200x100" },
    ];

    return (
        <ul className="dropdown-menu">
            {menuItems.map((item, index) => (
                <li key={index} className="dropdown-item">
                    <img src={item.image} alt={item.title} className="dropdown-image" />
                    <span className="dropdown-title">{item.title}</span>
                </li>
            ))}
        </ul>
    );
};

export default DropdownMenu;
