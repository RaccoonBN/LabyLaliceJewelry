import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import "./orderDetail.css";
import demosp from "../assets/demosp.png"; // Ảnh mặc định nếu sản phẩm không có ảnh

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API để lấy dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:2000/orders/${id}`);
        if (!response.ok) {
          throw new Error("Không tìm thấy đơn hàng!");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Nếu đang tải dữ liệu
  if (loading) {
    return <CircularProgress />;
  }

  // Nếu có lỗi
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <Container className="order-detail-container">
      {/* Nút quay lại */}
      <Button
        className="back-button"
        variant="contained"
        color="secondary"
        onClick={() => navigate(-1)}
      >
        ⬅ Quay lại
      </Button>

      {/* Thông tin đơn hàng */}
      <h4 className="order-title">Chi Tiết Đơn Hàng ({order.orderId})</h4>
      <p className="order-date">
        Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
      </p>
      <p className="order-status">
        Trạng thái: 
        <span
          className={`status ${order.status.replace(/\s+/g, "-").toLowerCase()}`}
        >
          {order.status}
        </span>
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
                  <img
                    src={item.image ? `http://localhost:4000/uploads/${item.image}` : "/default-image.jpg"}
                    alt={item.name}
                    className="product-image"
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {Number(item.price).toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell>
                  {Number(item.total).toLocaleString("vi-VN")} ₫
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tổng tiền */}
      <p className="total-price">
        Tổng hóa đơn: {Number(order.totalAmount).toLocaleString("vi-VN")} ₫
      </p>
    </Container>
  );
};

export default OrderDetail;
