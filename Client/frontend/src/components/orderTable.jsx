import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './orderTable.css';  // Import CSS

const OrderTable = ({ filter }) => {
  // Giả lập dữ liệu đơn hàng
  const orders = [
    {
      id: 1,
      date: "2025-01-10",
      price: 500000,
      status: "Đã Giao Hàng",
      items: [{ id: 101, name: "Nhẫn Kim Cương", image: "/images/ring.jpg", quantity: 1, price: 500000 }],
    },
    {
      id: 2,
      date: "2025-01-12",
      price: 250000,
      status: "Đã Gửi Hàng Đi",
      items: [{ id: 102, name: "Dây Chuyền Vàng", image: "/images/necklace.jpg", quantity: 1, price: 250000 }],
    },
    {
      id: 3,
      date: "2025-01-13",
      price: 300000,
      status: "Đang Giao",
      items: [{ id: 103, name: "Bông Tai Bạc", image: "/images/earring.jpg", quantity: 2, price: 150000 }],
    },
    {
      id: 4,
      date: "2025-01-14",
      price: 150000,
      status: "Đã Tiếp Nhận",
      items: [{ id: 104, name: "Nhẫn Vàng", image: "/images/gold-ring.jpg", quantity: 1, price: 150000 }],
    },
  ];

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
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.price.toLocaleString()} VND</TableCell>
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
    </TableContainer>
  );
};

export default OrderTable;
