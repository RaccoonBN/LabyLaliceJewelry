const mysql = require('mysql2');

// Cấu hình kết nối MySQL trên XAMPP
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // User mặc định của XAMPP
    password: '',        // Không có mật khẩu
    database: 'labylalice_jewelry', // Tên database của bạn
});

// Kết nối MySQL
connection.connect(err => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('✅ Kết nối MySQL thành công!');
});

module.exports = connection;
