// server/src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/database');

// Import file routes (Lưu ý tên file là authRoutes.js)
const authRoutes = require('./routes/authRoutes'); 
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require("./routes/userRoutes");

// SỬA LẠI: Load biến môi trường
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Kết nối Database
connectDB();

// Đồng bộ bảng (Chạy lần đầu để tạo bảng, sau đó có thể comment lại hoặc để nguyên)
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced!");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/users", userRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});