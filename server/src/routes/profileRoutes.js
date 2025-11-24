// server/src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// GET: /api/profile - Lấy thông tin profile (cần xác thực)
router.get('/', protect, getProfile);

module.exports = router;