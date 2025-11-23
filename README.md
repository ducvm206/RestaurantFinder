# Hướng dẫn cài đặt dự án ITSS Japanese

## Yêu cầu:
- Node.js
- PostgreSQL (Port 5432)

## Bước 1: Chuẩn bị Database
1. Mở pgAdmin (hoặc Terminal).
2. Tạo database mới tên là: `itss_japanese_db`.
3. Không cần tạo bảng, code sẽ tự tạo.

## Bước 2: Chạy Backend (Server)
cd server
npm install

# --- QUAN TRỌNG ---
# Copy file ví dụ ra file thật
cp .env.example .env

# Mở file .env lên và ĐIỀN MẬT KHẨU POSTGRES CỦA BẠN vào dòng DB_PASS
# ------------------

# Chạy lệnh tạo dữ liệu mẫu (Admin)
node seed.js

# Bật Server
npm start

## Bước 3: Chạy Frontend (Client)
cd client
npm install
npm start

## Tài khoản Test có sẵn:
- Email: admin@gmail.com
- Pass: 123456