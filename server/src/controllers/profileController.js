// server/src/controllers/profileController.js
const User = require('../models/User');

// Lấy thông tin profile của user đang đăng nhập
exports.getProfile = async (req, res) => {
  try {
    // req.user đã được gán từ authMiddleware
    const user = req.user;

    // Trả về thông tin user (đã loại bỏ password trong middleware)
    res.json({
      message: 'Lấy thông tin profile thành công',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        authType: user.authType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy profile:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin profile' });
  }
};