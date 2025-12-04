// server/src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  uploadAvatar,
  deleteAvatar 
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/debug-user', (req, res) => {
  if (!req.user) {
    return res.json({ message: 'No user in request' });
  }
  
  res.json({
    message: 'User data from authMiddleware',
    user: {
      user_id: req.user.user_id,
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
      authType: req.user.authType
    },
    rawUser: req.user.dataValues || req.user
  });
});

// All routes require authentication
router.use(protect);

// GET: /api/profile - Lấy thông tin profile
router.get('/', getProfile);

// PUT: /api/profile - Cập nhật thông tin profile
router.put('/', updateProfile);

// POST: /api/profile/upload-avatar - Upload avatar
router.post('/upload-avatar', uploadAvatar);

// DELETE: /api/profile/avatar - Xóa avatar
router.delete('/avatar', deleteAvatar);

module.exports = router;