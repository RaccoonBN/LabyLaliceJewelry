import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import momoLogo from "../assets/momo.png";
import vnpayLogo from "../assets/vnpay.png";
import axios from "axios";
import "./Order.css";

const Order = () => {
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cod",  // Phương thức thanh toán mặc định là COD
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);  // Lưu userId
  const [loading, setLoading] = useState(true); // Để kiểm soát trạng thái loading
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Chưa có token!");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:2000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data?.id) {
          setUserId(response.data.id);
        } else {
          console.error("Không lấy được userId từ profile");
        }
      })
      .catch((error) => console.error("Lỗi khi lấy profile:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    console.log("Danh sách mặt hàng trong giỏ hàng:", checkoutItems); // Kiểm tra dữ liệu
    setSelectedItems(checkoutItems.filter(item => item.checked));
  }, []);

  const handleChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value,
    });
  };

  const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("Không có userId, không thể tạo đơn hàng");
      alert("Vui lòng đăng nhập để tiếp tục!");
      return;
    }

    // Kiểm tra xem đã có thông tin đầy đủ chưa
    if (!orderDetails.name || !orderDetails.address || !orderDetails.phone) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const orderData = {
      userId,  // Đảm bảo userId đã được lấy từ API
      items: selectedItems.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })), // Chuyển đổi dữ liệu mặt hàng
      totalAmount,
      ...orderDetails, // Bao gồm các thông tin như tên, địa chỉ, phương thức thanh toán
    };
    console.log("Dữ liệu gửi lên API:", orderData);

    // Gửi yêu cầu POST đến API để tạo đơn hàng
    axios
      .post("http://localhost:2000/orders", orderData)
      .then((response) => {
        console.log("Đơn hàng được tạo thành công:", response.data);
        // Chuyển hướng đến trang thành công sau khi đơn hàng được tạo
        navigate("/order-success");
      })
      .catch((error) => {
        console.error("Lỗi khi tạo đơn hàng:", error.response ? error.response.data : error.message);
        alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      });
  };

  if (loading) {
    return <div>Loading...</div>;  // Hiển thị khi đang tải userId
  }

  return (
    <div className="order-page">
      <h2 className="order-page__title">Xác Nhận Đơn Hàng</h2>
      <form onSubmit={handleOrderSubmit} className="order-page__form">
        <input
          type="text"
          name="name"
          placeholder="Họ và Tên"
          value={orderDetails.name} // Đảm bảo có giá trị mặc định
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ nhận hàng"
          value={orderDetails.address} // Đảm bảo có giá trị mặc định
          required
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={orderDetails.phone} // Đảm bảo có giá trị mặc định
          required
          onChange={handleChange}
        />

        <h3>Phương Thức Thanh Toán</h3>
        <div className="order-page__payment-options">
          <label className="order-page__payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={orderDetails.paymentMethod === "cod"}
              onChange={handleChange}
            />
            <span>Thanh toán khi nhận hàng</span>
          </label>

          <label className="order-page__payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={orderDetails.paymentMethod === "momo"}
              onChange={handleChange}
            />
            <img
              src={momoLogo}
              alt="MoMo"
              className="order-page__payment-logo"
            />
            <span>MoMo</span>
          </label>

          <label className="order-page__payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="vnpay"
              checked={orderDetails.paymentMethod === "vnpay"}
              onChange={handleChange}
            />
            <img
              src={vnpayLogo}
              alt="VNPay"
              className="order-page__payment-logo"
            />
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
