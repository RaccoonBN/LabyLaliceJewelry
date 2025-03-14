import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import momoLogo from "../assets/momo.png";
import vnpayLogo from "../assets/vnpay.png";
import "./Order.css";

const Order = () => {
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    setSelectedItems(checkoutItems.filter(item => item.checked));
  }, []);

  const handleChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      userId,
      items: selectedItems.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })),
      totalAmount,
      ...orderDetails,
    };
    console.log("Order Data:", orderData);
    navigate("/order-success");
  };

  return (
    <div className="order-page">
      <h2 className="order-page__title">Xác Nhận Đơn Hàng</h2>
      <form onSubmit={handleOrderSubmit} className="order-page__form">
        <input type="text" name="name" placeholder="Họ và Tên" required onChange={handleChange} />
        <input type="text" name="address" placeholder="Địa chỉ nhận hàng" required onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Số điện thoại" required onChange={handleChange} />

        <h3>Phương Thức Thanh Toán</h3>
        <div className="order-page__payment-options">
          <label className="order-page__payment-option">
            <input type="radio" name="paymentMethod" value="cod" checked={orderDetails.paymentMethod === "cod"} onChange={handleChange} />
            <span>Thanh toán khi nhận hàng</span>
          </label>

          <label className="order-page__payment-option">
            <input type="radio" name="paymentMethod" value="momo" onChange={handleChange} />
            <img src={momoLogo} alt="MoMo" className="order-page__payment-logo" />
            <span>MoMo</span>
          </label>

          <label className="order-page__payment-option">
            <input type="radio" name="paymentMethod" value="vnpay" onChange={handleChange} />
            <img src={vnpayLogo} alt="VNPay" className="order-page__payment-logo" />
            <span>VNPay</span>
          </label>
        </div>

        <div className="order-page__summary">
          <h3>Chi Tiết Đơn Hàng</h3>
          <table className="order-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Tổng tiền:</strong> {totalAmount.toLocaleString()} VND</p>
        </div>

        <button type="submit" className="order-page__button">Đặt Hàng</button>
      </form>
    </div>
  );
};

export default Order;