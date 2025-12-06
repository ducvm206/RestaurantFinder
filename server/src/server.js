// server/src/server.js
const express = require('express');
const cors = require('cors');
const path = require("path");
const dotenv = require("dotenv");

// Load .env đúng vị trí
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

const { connectDB, sequelize } = require('./config/database');

const authRoutes = require('./routes/authRoutes'); 
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối Database
connectDB();

// Đồng bộ bảng
sequelize.sync();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/users", userRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
