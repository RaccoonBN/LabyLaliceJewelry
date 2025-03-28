import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./orderTable.css";

const OrderTable = ({ filter }) => {
  const [orders, setOrders] = useState([]); // ✅ Sử dụng đúng state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Chưa có token!");
      setError("Bạn cần đăng nhập để xem đơn hàng.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:2000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data?.id) {
          const fetchedUserId = response.data.id;
          console.log("✅ UserID lấy được:", fetchedUserId);
          setUserId(fetchedUserId);

          return axios.get(
            `http://localhost:2000/orders/all/${fetchedUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          throw new Error("❌ Không lấy được thông tin user");
        }
      })
      .then((orderResponse) => {
        console.log("📦 Dữ liệu đơn hàng nhận từ API:", orderResponse.data);
        if (!Array.isArray(orderResponse.data)) {
          setError("Dữ liệu không hợp lệ!");
          return;
        }
        setOrders(orderResponse.data); // ✅ Sửa từ setOrder thành setOrders
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy dữ liệu:", error);
        setError("Lỗi khi tải dữ liệu đơn hàng.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Lọc đơn hàng theo trạng thái (nếu có bộ lọc)
  const filteredOrders = filter
    ? orders.filter((order) => order.status === filter)
    : orders;

  const getStatusClass = (status) => {
    switch (status) {
      case "Đã Giao Hàng":
        return "status-dagiao";
      case "Đã Gửi Hàng Đi":
        return "status-daguihang";
      case "Đang Giao":
        return "status-dangiao";
      case "Đã Tiếp Nhận":
        return "status-datiepnhan";
      default:
        return "status-default";
    }
  };

  return (
    <TableContainer className="table-container">
      {loading ? (
        <p>Đang tải dữ liệu đơn hàng...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Mã Đơn Hàng</strong>
              </TableCell>
              <TableCell>
                <strong>Ngày</strong>
              </TableCell>
              <TableCell>
                <strong>Tổng</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái đơn hàng</strong>
              </TableCell>
              <TableCell>
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {Number.parseInt(order.total).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </TableCell>
                <TableCell>
                  <span className={`status-cell ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/orders/${order.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" color="primary">
                      Xem Chi Tiết
                    </Button>
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
