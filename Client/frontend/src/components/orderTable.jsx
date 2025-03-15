import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';  // Import axios
import './orderTable.css';  // Import CSS

const OrderTable = ({ filter }) => {
  const [orders, setOrders] = useState([]);  // State để lưu danh sách đơn hàng
  const [loading, setLoading] = useState(true);  // State để kiểm tra trạng thái loading

  // Lấy danh sách đơn hàng từ API sử dụng axios
  useEffect(() => {
    axios
      .get('http://localhost:2000/orders/all')  // Đảm bảo đường dẫn API đúng
      .then((response) => {
        setOrders(response.data);  // Lưu dữ liệu vào state
        setLoading(false);  // Đặt loading = false khi dữ liệu đã được tải xong
      })
      .catch((error) => {
        console.error('Lỗi khi lấy đơn hàng:', error);
        setLoading(false);  // Đặt loading = false nếu có lỗi xảy ra
      });
  }, []);  // Chạy effect chỉ khi component mount

  // Lọc các đơn hàng theo trạng thái nếu có filter
  const filteredOrders = filter
    ? orders.filter(order => order.status === filter)
    : orders;

  // Hàm để chọn class cho trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case 'Đã Giao Hàng':
        return 'status-dagiao';
      case 'Đã Gửi Hàng Đi':
        return 'status-daguihang';
      case 'Đang Giao':
        return 'status-dangiao';
      case 'Đã Tiếp Nhận':
        return 'status-datiepnhan';
      default:
        return 'status-default';
    }
  };

  return (
    <TableContainer className="table-container">
      {loading ? (
        <p>Đang tải dữ liệu đơn hàng...</p>  // Hiển thị khi đang tải dữ liệu
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã Đơn Hàng</strong></TableCell>
              <TableCell><strong>Ngày</strong></TableCell>
              <TableCell><strong>Tổng</strong></TableCell>
              <TableCell><strong>Trạng thái đơn hàng</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.created_at.split('T')[0]}</TableCell>  {/* Hiển thị ngày (nếu trả về kiểu ISO 8601) */}
                <TableCell>{order.total.toLocaleString()} VND</TableCell>
                <TableCell>
                  <span className={`status-cell ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Link to={`/orders/${order.id}`} style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="primary">Xem Chi Tiết</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default OrderTable;
