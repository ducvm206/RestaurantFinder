// server/src/middleware/authMiddleware.js - UPDATED VERSION
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('🔑 Decoded token:', decoded);
      
      // The token contains { id: user_id_value }
      const userId = decoded.id; // This is the user_id from database
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          message: 'Token không chứa thông tin người dùng' 
        });
      }

      // Find user by primary key (user_id)
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      console.log('👤 User found by user_id:', userId, '=>', user ? 'Found' : 'Not found');

      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Không tìm thấy người dùng' 
        });
      }

      // Create req.user object with consistent structure
      req.user = {
        id: user.user_id,        // For compatibility with code expecting 'id'
        user_id: user.user_id,   // Original database user_id
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        authType: user.authType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      console.log('✅ Auth successful. req.user:', {
        id: req.user.id,
        user_id: req.user.user_id,
        email: req.user.email
      });

      next();
    } catch (error) {
      console.error('❌ Lỗi xác thực token:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false,
      message: 'Không tìm thấy token xác thực' 
    });
  }
};

module.exports = { protect };