// server/src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB, sequelize } = require("./config/database");

// Import file routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const recommendationRouters = require("./routes/recommendationRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-data

// ⭐ CRITICAL: Serve static files from uploads directory
// This allows uploaded avatars to be accessible via URL
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log uploads directory for debugging
console.log('📁 Uploads directory:', path.join(__dirname, '../uploads'));

// Database connection
connectDB();

// Sync database tables
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/recommendations", recommendationRouters);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    uploadsPath: path.join(__dirname, '../uploads')
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Static files served from: /uploads`);
});

module.exports = app;
