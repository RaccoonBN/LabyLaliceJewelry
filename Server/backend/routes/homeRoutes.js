const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const month = parseInt(req.query.month);
        const year = parseInt(req.query.year);

        if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
            return res.status(400).json({ error: "Tháng hoặc năm không hợp lệ" });
        }

        // Lấy tổng số người dùng
        const [usersResult] = await connection.execute("SELECT COUNT(*) AS totalUsers FROM users");
        const totalUsers = usersResult[0].totalUsers;

        // Lấy tổng số đơn hàng trong tháng/năm
        const [ordersResult] = await connection.execute(
            "SELECT COUNT(*) AS totalOrders FROM orders WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
            [month, year]
        );
        const totalOrders = ordersResult[0].totalOrders;

        // Lấy tổng doanh thu
        const [revenueResult] = await connection.execute(
            "SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
            [month, year]
        );
        const totalRevenue = parseFloat(revenueResult[0].totalRevenue) || 0;

        // Lấy doanh thu theo tuần
        const sqlRevenueByWeek = `
        SELECT 
            CASE 
                WHEN DAY(created_at) BETWEEN 1 AND 7 THEN 1
                WHEN DAY(created_at) BETWEEN 8 AND 14 THEN 2
                WHEN DAY(created_at) BETWEEN 15 AND 21 THEN 3
                ELSE 4
            END AS week, 
            SUM(total) AS revenue
        FROM orders
        WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
        GROUP BY week
        ORDER BY week;
        `;
        const [revenueByWeekResult] = await connection.execute(sqlRevenueByWeek, [month, year]);

        // Mặc định doanh thu 4 tuần = 0
        const revenueByWeek = { week1: 0, week2: 0, week3: 0, week4: 0 };

        revenueByWeekResult.forEach(row => {
            const weekNumber = row.week;
            if (weekNumber >= 1 && weekNumber <= 4) {
                revenueByWeek[`week${weekNumber}`] = parseFloat(row.revenue) || 0;
            }
        });

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
                        label: `Doanh thu (Tháng ${month} - ${year})`,
                        data: [
                            revenueByWeek.week1,
                            revenueByWeek.week2,
                            revenueByWeek.week3,
                            revenueByWeek.week4
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
