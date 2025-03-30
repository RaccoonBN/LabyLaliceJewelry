import React, { useState, useEffect } from "react";
import axios from "axios";
import "./order.css";
import { FaInfoCircle } from "react-icons/fa";
import moment from 'moment';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
            if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else {
                console.error("API trả về dữ liệu không hợp lệ (không phải mảng):", response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:4000/orders/${orderId}/status`, { status: newStatus });
            setOrders(
                orders.map(order =>
                    order.order_id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        }
    };

    const calculateTotal = (products) => {
        if (!products || products.length === 0) {
            return 0;
        }
        return products.reduce((sum, item) => sum + item.quantity * item.price, 0);
    };

    const filteredOrders = filterStatus
        ? orders.filter(order => order.status === filterStatus)
        : orders;

    const generatePDF = async (order) => {
        const input = document.getElementById('order-detail-pdf'); // Sử dụng ID mới
        if (!input) {
            console.error("Không tìm thấy phần tử với id 'order-detail-pdf'");
            return;
        }

        try {
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`order-${order.order_id}.pdf`);
        } catch (error) {
            console.error("Lỗi tạo PDF:", error);
        }
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(orders);
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, 'orders.xlsx');
    };

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

            <button className="export-excel-button" onClick={exportToExcel}>Xuất Excel</button>

            <table className="order-table">
                <thead>
                    <tr>
                        <th className="order-header">Mã đơn hàng</th>
                        <th className="order-header">Tên khách hàng</th>
                        <th className="order-header">Số điện thoại</th>
                        <th className="order-header">Địa chỉ</th>
                        <th className="order-header">Số lượng sản phẩm</th>
                        <th className="order-header">Tổng tiền</th>
                        <th className="order-header">Thanh toán</th>
                        <th className="order-header">Thời gian đặt hàng</th>
                        <th className="order-header">Trạng thái</th>
                        <th className="order-header">Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.order_id} className="order-row">
                            <td className="order-cell">{order.order_id}</td>
                            <td className="order-cell">{order.customer_name}</td>
                            <td className="order-cell">{order.customer_phone}</td>
                            <td className="order-cell">{order.customer_address}</td>
                            <td className="order-cell">
                                {order.products ? order.products.reduce((sum, item) => sum + item.quantity, 0) : 0}
                            </td>
                            <td className="order-cell">{calculateTotal(order.products).toLocaleString()} đ</td>
                            <td className="order-cell">{order.payment_method}</td>
                            <td className="order-cell">
                                {order.created_at ? moment(order.created_at).format('DD/MM/YYYY HH:mm') : 'N/A'}
                            </td>
                            <td className="order-cell">
                                <select
                                    className="order-status-select"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.order_id, e.target.value)}
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
                    <div className="order-modal-content" id="order-detail">
                        {/* Container cho nội dung PDF */}
                        <div id="order-detail-pdf">
                            <h3>Chi tiết đơn hàng</h3>
                            <p><strong>Khách hàng:</strong> {selectedOrder.customer_name}</p>
                            <p><strong>Số điện thoại:</strong> {selectedOrder.customer_phone}</p>
                            <p><strong>Địa chỉ:</strong> {selectedOrder.customer_address}</p>
                            <p><strong>Thời gian đặt hàng:</strong> {selectedOrder.created_at ? moment(selectedOrder.created_at).format('DD/MM/YYYY HH:mm') : 'N/A'}</p>
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
                                    {selectedOrder.products && selectedOrder.products.map((product, index) => (
                                        <tr key={product.id || index}>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.price ? product.price.toLocaleString() : 'N/A'} đ</td>
                                            <td>{product.price ? (product.quantity * product.price).toLocaleString() : 'N/A'} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <hr />
                            <p><strong>Tổng tiền:</strong> {calculateTotal(selectedOrder.products).toLocaleString()} đ</p>
                        </div>

                        <button className="export-pdf-button" onClick={() => generatePDF(selectedOrder)}>Xuất PDF</button>
                        <button className="close-modal" onClick={() => setSelectedOrder(null)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;