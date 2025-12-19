// server/src/routes/profileRoutes.js - MINIMAL FIX
const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  uploadAvatar, // This already includes multer middleware!
  deleteAvatar 
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(protect);

// GET: /api/profile - Get profile
router.get('/', getProfile);

// PUT: /api/profile - Update profile
router.put('/', updateProfile);

// POST: /api/profile/upload-avatar - Upload avatar
// ⚠️ IMPORTANT: Don't add multer middleware here - controller already has it!
router.post('/upload-avatar', uploadAvatar);

// DELETE: /api/profile/avatar - Delete avatar
router.delete('/avatar', deleteAvatar);

module.exports = router;