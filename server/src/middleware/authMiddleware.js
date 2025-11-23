// server/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực JWT token
const protect = async (req, res, next) => {
  let token;

  // Kiểm tra header Authorization có tồn tại và có format "Bearer <token>" không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header (bỏ chữ "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verify token và giải mã
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ database (không lấy password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      next(); // Cho phép tiếp tục đến controller
    } catch (error) {
      console.error('Lỗi xác thực token:', error);
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  } else {
    return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
  }
};

module.exports = { protect };