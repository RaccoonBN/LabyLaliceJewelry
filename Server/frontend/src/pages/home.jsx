import React, { useState, useEffect } from "react";
import "./home.css";
import { FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios"; // Import axios

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL = "http://localhost:4000/home"; 

const Home = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
    const [revenueData, setRevenueData] = useState({
        labels: [],
        datasets: [],
    });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`, {
                params: { month: selectedMonth + 1, year: selectedYear }, // Pass month & year to the API
            });
            setStats(response.data.stats);
            setRevenueData(response.data.revenueData);
        } catch (error) {
            console.error("Error fetching home data:", error);
        }
    };

    const months = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
        "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
        "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    const years = [2023, 2024, 2025];

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    return (
        <div className="home-container">
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
                    <h3>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}</h3>
                    <p>Doanh thu</p>
                </div>
            </div>

            <div className="filter-container">
                <select value={selectedMonth} onChange={handleMonthChange}>
                    {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>

                <select value={selectedYear} onChange={handleYearChange}>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="chart-container">
                <h2>Doanh thu theo tuần</h2>
                <Bar data={revenueData} />
            </div>
        </div>
    );
};

export default Home;