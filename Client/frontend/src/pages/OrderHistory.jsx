import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import OrderTable from '../components/orderTable';
import './OrderHistory.css'; // Import CSS

const OrderHistory = () => {
  const [statusFilter, setStatusFilter] = useState('');

  // Hàm để lọc trạng thái đơn hàng
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  return (
    <Container className="order-history-container">
      <Typography variant="h4" gutterBottom>Danh Sách Đơn Hàng</Typography>
      
      <div className="status-filter">
        <label htmlFor="statusFilter">Lọc theo trạng thái:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đã Giao Hàng">Đã Giao Hàng</option>
          <option value="Đã Gửi Hàng Đi">Đã Gửi Hàng Đi</option>
          <option value="Đang Giao">Đang Giao</option>
          <option value="Đã Tiếp Nhận">Đã Tiếp Nhận</option>
        </select>
      </div>

      <OrderTable filter={statusFilter} />
    </Container>
  );
};

export default OrderHistory;
