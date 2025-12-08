// server/src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB, sequelize } = require("./config/database");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const recommendationRouters = require("./routes/recommendationRoutes");
const restaurantReviewRoutes = require("./routes/restaurantReviewRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");

dotenv.config();

// Create Express app
const app = express();

// Parse cookies
app.use(cookieParser());

// ⭐ CORS CHUẨN CHO COOKIE-BASED AUTH
app.use(
  cors({
    origin: "http://localhost:3000", // FE
    credentials: true, // Cho phép gửi cookie
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log("📁 Uploads directory:", path.join(__dirname, "../uploads"));

// Connect DB
connectDB();

sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/recommendations", recommendationRouters);
app.use("/api/restaurant-reviews", restaurantReviewRoutes);
app.use("/api/restaurants", restaurantRoutes);
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Static files served from: /uploads`);
});

module.exports = app;
