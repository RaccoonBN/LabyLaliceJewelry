import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import "./orderDetail.css";
import demosp from "../assets/demosp.png"; // Đường dẫn logo

// Dữ liệu mẫu đơn hàng
const orders = [
  {
    id: 1,
    date: "2025-01-10",
    price: 500000,
    status: "Đã Giao Hàng",
    items: [{ id: 101, name: "Nhẫn Kim Cương", image: demosp, quantity: 1, price: 500000 }],
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

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === parseInt(id));

  if (!order) {
    return <p className="error-message">Không tìm thấy đơn hàng!</p>;
  }

  return (
    <Container className="order-detail-container">
      {/* Nút quay lại */}
      <Button className="back-button" variant="contained" color="secondary" onClick={() => navigate(-1)}>⬅ Quay lại</Button>

      {/* Thông tin đơn hàng */}
      <h4 className="order-title">Chi Tiết Đơn Hàng ({order.id})</h4>
      <p className="order-date">Ngày đặt hàng: {order.date}</p>
      <p className="order-status">
        Trạng thái: <span className={`status ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>{order.status}</span>
      </p>

      {/* Bảng sản phẩm */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Hình Ảnh</strong></TableCell>
              <TableCell><strong>Sản Phẩm</strong></TableCell>
              <TableCell><strong>Số Lượng</strong></TableCell>
              <TableCell><strong>Giá</strong></TableCell>
              <TableCell><strong>Tổng</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img src={item.image} alt={item.name} className="product-image" />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price.toLocaleString()} VND</TableCell>
                <TableCell>{(item.price * item.quantity).toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tổng tiền */}
      <p className="total-price">Tổng hóa đơn: {order.price.toLocaleString()} VND</p>
    </Container>
  );
};

export default OrderDetail;
