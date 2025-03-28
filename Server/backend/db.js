const mysql = require('mysql2/promise'); // Import mysql2 với hỗ trợ promise

// Cấu hình connection pool MySQL trên XAMPP
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',        // User mặc định của XAMPP
    password: '',        // Không có mật khẩu
    database: 'labylalice_jewelry', // Tên database của bạn
    connectionLimit: 10 // Số lượng kết nối tối đa trong pool
});

// Kiểm tra kết nối (tùy chọn)
pool.getConnection()
    .then(connection => {
        console.log('✅ Kết nối MySQL thành công!');
        connection.release(); // Trả kết nối về pool
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối MySQL:', err);
    });

module.exports = pool;