import React, { useState, useEffect } from "react";
import axios from "axios";
import "./order.css";
import { FaInfoCircle } from "react-icons/fa";

const API_BASE_URL = "http://localhost:4000/orders/all";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const ordersWithProducts = response.data.map(order => ({
        ...order,
        products: order.products || []
      }));
      setOrders(ordersWithProducts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/${orderId}`, { status: newStatus });
      setOrders(
        orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const calculateTotal = (products) => {
    return products ? products.reduce((sum, item) => sum + item.quantity * item.price, 0) : 0;
  };

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  return (
    <div className="order-container">
      <h2 className="order-title">Quản lý Đơn Hàng</h2>

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
            <tr key={order._id} className="order-row">
              <td className="order-cell">{order.name}</td>
              <td className="order-cell">{order.phone}</td>
              <td className="order-cell">{order.address}</td>
              <td className="order-cell">
                {order.products ? order.products.reduce((sum, item) => sum + item.quantity, 0) : 0}
              </td>
              <td className="order-cell">{calculateTotal(order.products).toLocaleString()} đ</td>
              <td className="order-cell">{order.payment}</td>
              <td className="order-cell">
                <select
                  className="order-status-select"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
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
                <tr key={product.id || `${product.name}-${index}`}> {/* ✅ Đảm bảo key duy nhất */}
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
