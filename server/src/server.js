// server/src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB, sequelize } = require("./config/database");

// Load .env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Create Express app
const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const restaurantReviewRoutes = require("./routes/restaurantReviewRoutes");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

console.log("📁 Uploads directory:", uploadsPath);
console.log("📁 Current directory:", __dirname);

// Connect to DB
connectDB();

// Sync database tables
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database synced!"))
  .catch((err) => console.error("❌ Sync error:", err.message));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/restaurant-reviews", restaurantReviewRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    uploadsPath,
    uploadsUrl: `http://localhost:${process.env.PORT || 5000}/uploads/`,
  });
});

// Debug route
app.get("/api/debug/user", (req, res) => {
  if (!req.user) {
    return res.json({
      hasUser: false,
      message: "No user in request (missing auth middleware)",
    });
  }

  res.json({
    hasUser: true,
    user: req.user,
    headers: {
      authorization: req.headers.authorization,
    },
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Serving static files from: /uploads`);
  console.log(
    `🌐 Avatar URL example: http://localhost:${PORT}/uploads/avatars/example.png`
  );
});

module.exports = app;
