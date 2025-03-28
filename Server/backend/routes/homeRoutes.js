const express = require("express");
const router = express.Router();
const pool = require("../db");

// API lấy dữ liệu cho trang Home
router.get("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // 1. Lấy tổng số người dùng
        const [usersResult] = await connection.execute("SELECT COUNT(*) AS totalUsers FROM users");
        const totalUsers = usersResult[0].totalUsers;

        // 2. Lấy tổng số đơn hàng
        const [ordersResult] = await connection.execute("SELECT COUNT(*) AS totalOrders FROM orders");
        const totalOrders = ordersResult[0].totalOrders;

        // 3. Lấy tổng doanh thu
        const [revenueResult] = await connection.execute("SELECT SUM(total) AS totalRevenue FROM orders");
        const totalRevenue = revenueResult[0].totalRevenue || 0; // Tránh trường hợp null

        // 4. Lấy dữ liệu doanh thu theo tuần của tháng hiện tại (giả lập)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        // Bạn cần điều chỉnh truy vấn này để phù hợp với cấu trúc dữ liệu của bạn
        // Truy vấn này giả định rằng bạn có thể tính toán doanh thu theo tuần dựa trên `created_at`
        const sqlRevenueByWeek = `
            SELECT
                SUM(CASE WHEN WEEK(created_at, 1) = WEEK(DATE_SUB(?, INTERVAL 0 DAY), 1) THEN total ELSE 0 END) AS week1,
                SUM(CASE WHEN WEEK(created_at, 1) = WEEK(DATE_SUB(?, INTERVAL 7 DAY), 1) THEN total ELSE 0 END) AS week2,
                SUM(CASE WHEN WEEK(created_at, 1) = WEEK(DATE_SUB(?, INTERVAL 14 DAY), 1) THEN total ELSE 0 END) AS week3,
                SUM(CASE WHEN WEEK(created_at, 1) = WEEK(DATE_SUB(?, INTERVAL 21 DAY), 1) THEN total ELSE 0 END) AS week4
            FROM orders
            WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
        `;
        const [revenueByWeekResult] = await connection.execute(sqlRevenueByWeek, [currentDate,currentDate,currentDate,currentDate, currentMonth, currentYear]);
        const revenueByWeek = revenueByWeekResult[0];

        const responseData = {
            stats: {
                users: totalUsers,
                orders: totalOrders,
                revenue: totalRevenue,
            },
            revenueData: {
                labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
                datasets: [
                    {
                        label: `Doanh thu (Tháng ${currentMonth} - ${currentYear})`,
                        data: [
                            revenueByWeek.week1 || 0,
                            revenueByWeek.week2 || 0,
                            revenueByWeek.week3 || 0,
                            revenueByWeek.week4 || 0
                        ],
                        backgroundColor: "rgba(222, 75, 177, 0.6)",
                        borderColor: "#DE4BB1",
                        borderWidth: 2,
                    },
                ],
            },
        };

        res.json(responseData);
    } catch (err) {
        console.error("Lỗi API trang chủ:", err);
        return res.status(500).json({ error: "Lỗi server" });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;