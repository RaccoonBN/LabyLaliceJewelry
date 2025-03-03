import React, { useState } from "react";
import "./order.css";
import { FaInfoCircle } from "react-icons/fa";

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0123456789",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      products: [
        { name: "Dây chuyền nữ kim cương", quantity: 1, price: 35000000 },
        { name: "Nhẫn cầu hôn", quantity: 1, price: 2500000 },
      ],
      payment: "Chuyển khoản",
      status: "Đã Tiếp Nhận",
    },
    {
      id: 2,
      name: "Trần Thị B",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      products: [
        { name: "Bộ trang sức Valentine ", quantity: 1, price: 32000000 },
        { name: "Lắc tay vàng 24k", quantity: 2, price: 4500000 },
      ],
      payment: "Thanh toán khi nhận hàng",
      status: "Đang Giao",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const calculateTotal = (products) => {
    return products.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };
  const [filterStatus, setFilterStatus] = useState(""); // Trạng thái lọc


  // Lọc đơn hàng theo trạng thái
  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  return (
    <div className="order-container">
      <h2 className="order-title">Quản lý Đơn Hàng</h2>

      {/* Bộ lọc đơn hàng */}
      <div className="filter-container">
        <label className="filter-label">Lọc theo trạng thái:</label>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="Đã Giao Hàng">Đã Giao Hàng</option>
          <option value="Đã Gửi Hàng Đi">Đã Gửi Hàng Đi</option>
          <option value="Đang Giao">Đang Giao</option>
          <option value="Đã Tiếp Nhận">Đã Tiếp Nhận</option>
        </select>
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th className="order-header">Tên khách hàng</th>
            <th className="order-header">Số điện thoại</th>
            <th className="order-header">Địa chỉ</th>
            <th className="order-header">Số lượng sản phẩm</th>
            <th className="order-header">Tổng tiền</th>
            <th className="order-header">Thanh toán</th>
            <th className="order-header">Trạng thái</th>
            <th className="order-header">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
        {filteredOrders.map((order) => (
            <tr key={order.id} className="order-row">
              <td className="order-cell">{order.name}</td>
              <td className="order-cell">{order.phone}</td>
              <td className="order-cell">{order.address}</td>
              <td className="order-cell">
                {order.products.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td className="order-cell">{calculateTotal(order.products).toLocaleString()} đ</td>
              <td className="order-cell">{order.payment}</td>
              <td className="order-cell">
                <select
                  className="order-status-select"
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="Đã Giao Hàng">Đã Giao Hàng</option>
                  <option value="Đã Gửi Hàng Đi">Đã Gửi Hàng Đi</option>
                  <option value="Đang Giao">Đang Giao</option>
                  <option value="Đã Tiếp Nhận">Đã Tiếp Nhận</option>
                </select>
              </td>
              <td className="order-cell">
                <FaInfoCircle
                  className="order-info-icon"
                  onClick={() => setSelectedOrder(order)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Chi Tiết Đơn Hàng */}
      {selectedOrder && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h3>Chi tiết đơn hàng</h3>
            <p><strong>Khách hàng:</strong> {selectedOrder.name}</p>
            <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
            <hr />
            <table className="order-detail-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price.toLocaleString()} đ</td>
                    <td>{(product.quantity * product.price).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
            <p><strong>Tổng tiền:</strong> {calculateTotal(selectedOrder.products).toLocaleString()} đ</p>
            <button className="close-modal" onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
