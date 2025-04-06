Dưới đây là nội dung tệp `README.md` cho dự án của bạn với hướng dẫn cài đặt và chạy dự án:

```markdown
# LabyLalice Jewelry - Website E-commerce with Prediction Model and Chatbot

## Hướng Dẫn Cài Đặt và Chạy Dự Án

### 1. Yêu Cầu Hệ Thống

Để chạy dự án, bạn cần cài đặt các phần mềm sau:

- **Node.js** (Phiên bản LTS hoặc mới hơn)
- **Python** (Phiên bản 3.10)
- **MySQL** (Sử dụng XAMPP hoặc MySQL Server)
- **Rasa** (Chatbot framework)

### 2. Cài Đặt

#### Bước 1: Tải Mã Nguồn

Tải hai file ZIP sau về và giải nén vào thư mục làm việc của bạn:
- **Trang web (Frontend & Backend)** – `LabyLaliceJewelry.zip`
- **Mô hình dự đoán doanh thu** – `dudoandoanhthu.zip`

Giải nén cả hai thư mục vào vị trí bạn muốn.

#### Bước 2: Cài Đặt Cơ Sở Dữ Liệu

1. Mở **MySQL** (Sử dụng **XAMPP** hoặc **MySQL Workbench**).
2. Tạo một **database mới** với tên `labylalice_jewelry`.
3. Import file **SQL** chứa dữ liệu ban đầu vào database của bạn.

#### Bước 3: Cài Đặt Backend (Server + Client)

1. Mở thư mục **Backend** trong cả 2 thư mục **Client** và **Server**.
2. Cài đặt các dependencies bằng lệnh:
   ```bash
   npm install
   ```
3. Khởi chạy server backend với lệnh:
   ```bash
   nodemon server.js
   ```

#### Bước 4: Cài Đặt Frontend (Server + Client)

1. Mở thư mục **Frontend** trong cả 2 thư mục **Client** và **Server**.
2. Cài đặt các dependencies:
   ```bash
   npm install
   ```
3. Chạy ứng dụng frontend của Client:
   ```bash
   npm start
   ```
4. Để chạy frontend của Server trên cổng khác (port 3001), sử dụng:
   ```bash
   $env:PORT=3001; npm start
   ```

#### Bước 5: Chạy Chatbot (Rasa)

1. Mở thư mục **chatbot** trong thư mục **Client**.
2. Chạy lệnh sau để khởi chạy Rasa:
   ```bash
   rasa run --enable-api --cors "*" --debug
   ```
3. Chạy action server của chatbot:
   ```bash
   rasa run actions
   ```

#### Bước 6: Chạy Mô Hình Dự Đoán Doanh Thu

1. Mở thư mục chứa mô hình dự đoán doanh thu.
2. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
3. Chạy API mô hình dự đoán doanh thu bằng lệnh:
   ```bash
   python api.py
   ```

### 3. Hoàn Tất

Sau khi thực hiện các bước trên, hệ thống của bạn sẽ hoạt động với các thành phần sau:

- **Frontend của Client** chạy trên: [http://localhost:3000]
- **Backend của Client** chạy trên: [http://localhost:2000]
- **Frontend của Server** chạy trên: [http://localhost:3001]
- **Backend của Server** chạy trên: [http://localhost:4000]
- **Chatbot API** chạy trên: [http://localhost:5005]
- **Dịch vụ mô hình dự đoán doanh thu** chạy trên: [http://localhost:5000]

### 4. Khắc Phục Lỗi

Nếu gặp lỗi trong quá trình chạy dự án:
- Kiểm tra lại các bước trong hướng dẫn để đảm bảo bạn đã thực hiện đúng.
- Kiểm tra log lỗi trong terminal để xác định nguyên nhân và khắc phục.
- Đảm bảo rằng tất cả các dịch vụ đều đang chạy trên đúng cổng.



