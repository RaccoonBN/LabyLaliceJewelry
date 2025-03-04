import React, { useState } from 'react';
import './Cart.css';
import demosp from "../assets/demosp.png";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  // Danh sách sản phẩm trong giỏ hàng
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Nhẫn Kim Cương', collection: 'Luxury', price: 7000000, quantity: 1, image: demosp, checked: false },
    { id: 2, name: 'Dây Chuyền Vàng', collection: 'Classic', price: 5000000, quantity: 1, image: demosp, checked: false },
  ]);
  const navigate = useNavigate();
  const handleCheckout = () => {
    if (totalPrice > 0) {
      navigate("/order");
    }
  };
  // Xử lý chọn sản phẩm
  const toggleCheckbox = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Xử lý thay đổi số lượng sản phẩm
  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Tính tổng tiền theo sản phẩm đã chọn
  const totalPrice = cartItems
    .filter(item => item.checked)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="shopping-cart">
      <header className="cart-header">
        <h2 className="cart-title">🛒 Giỏ Hàng Của Bạn</h2>
      </header>
      <div className="cart-content">
        <div className="cart-items-container">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheckbox(item.id)}
                />
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <p className="item-collection">{item.collection}</p>
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">{item.price.toLocaleString()} VND</p>
                </div>
                <div className="item-quantity">
                  <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <input type="number" value={item.quantity} readOnly className="quantity-input" />
                  <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <button className="remove-item" onClick={() => removeItem(item.id)}>✖</button>
              </div>
            ))
          ) : (
            <p className="empty-cart">Giỏ hàng của bạn đang trống! 🛒</p>
          )}
        </div>
        <div className="order-summary">
          <h3 className="cart-title">📋 Tóm Tắt Đơn Hàng</h3>
          <p className="order-subtotal">Tổng tiền hàng: {totalPrice.toLocaleString()} VND</p>
          <p className="order-shipping">Phí vận chuyển: Miễn phí</p>
          <p className="order-total">Tổng: {totalPrice.toLocaleString()} VND</p>
          <div className="order-actions">
          <button 
            className="checkout-btn" 
            disabled={totalPrice === 0}
            onClick={handleCheckout}
          >
            Thanh Toán
          </button>            
          <button className="continue-btn">Mua Thêm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
