import React, { useState } from "react";
import "./home.css";
import { FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần của biểu đồ
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  // Dữ liệu thống kê
  const stats = {
    users: 1250,
    orders: 345,
    revenue: 2580000,
  };

  // Danh sách tháng & năm
  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  const years = [2023, 2024, 2025];

  // State chọn tháng & năm
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Dữ liệu doanh thu giả lập
  const revenueData = {
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    datasets: [
      {
        label: `Doanh thu (${months[selectedMonth]} - ${selectedYear})`,
        data: [1000000, 1200000, 900000, 1400000], // Dữ liệu giả lập
        backgroundColor: "rgba(222, 75, 177, 0.6)",
        borderColor: "#DE4BB1",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="home-container">
      {/* Phần tổng quan */}
      <div className="stats">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h3>{stats.users}</h3>
          <p>Người dùng</p>
        </div>
        <div className="stat-card">
          <FaShoppingCart className="stat-icon" />
          <h3>{stats.orders}</h3>
          <p>Đơn hàng</p>
        </div>
        <div className="stat-card">
          <FaDollarSign className="stat-icon" />
          <h3>{stats.revenue.toLocaleString()} VND</h3>
          <p>Doanh thu</p>
        </div>
      </div>

      {/* Phần chọn tháng & năm */}
      <div className="filter-container">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Phần biểu đồ */}
      <div className="chart-container">
        <h2>Doanh thu theo tuần</h2>
        <Bar data={revenueData} />
      </div>
    </div>
  );
};

export default Home;
