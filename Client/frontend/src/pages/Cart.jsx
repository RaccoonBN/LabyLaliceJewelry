import React from 'react';
import './Cart.css';

const Cart = () => {
  return (
    <div className="shopping-cart">
      <header className="cart-header">
        <h2 className="cart-title">Giỏ Hàng Của Bạn</h2>
      </header>
      <div className="cart-content">
        <div className="cart-items-container">
          <div className="cart-item">
            <input type="checkbox" className="item-checkbox" />
            <img src="ring.jpg" alt="Product" className="item-image" />
            <div className="item-details">
              <p className="item-collection">Tên Bộ Sưu Tập</p>
              <p className="item-name">Tên Sản Phẩm</p>
              <p className="item-price">7.000.000 VND</p>
            </div>
            <div className="item-quantity">
              <button className="quantity-btn">-</button>
              <input type="number" value="1" readOnly className="quantity-input" />
              <button className="quantity-btn">+</button>
            </div>
            <button className="remove-item">✖</button>
          </div>
        </div>
        <div className="order-summary">
          <h3 className="cart-title">Tóm Tắt Đơn Hàng</h3>
          <p className="order-subtotal">Tổng tiền hàng: 7.000.000 VND</p>
          <p className="order-shipping">Phí vận chuyển: Miễn phí</p>
          <p className="order-total">Tổng: 7.000.000 VND</p>
          <div className="order-actions">
            <button className="checkout-btn">Thanh Toán</button>
            <button className="continue-btn">Mua Thêm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
