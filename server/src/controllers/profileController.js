// server/src/controllers/profileController.js
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userId_timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('画像ファイルのみアップロード可能です (JPEG, JPG, PNG, GIF, WebP)'));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

// GET: Lấy thông tin profile
// GET: Lấy thông tin profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    console.log('Getting profile for user_id:', user.user_id); // Debug

    res.json({
      message: 'Lấy thông tin profile thành công',
      user: {
        id: user.user_id, // FIXED: Map user_id to id
        user_id: user.user_id,
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

// PUT: Cập nhật thông tin profile
// PUT: Cập nhật thông tin profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, avatar } = req.body;
    
    // Get user_id from req.user (should be set by authMiddleware)
    const userId = req.user.user_id; // FIXED: Use user_id
    
    console.log('Updating profile for user_id:', userId); // Debug
    
    if (!userId) {
      return res.status(400).json({ message: 'ユーザーIDが見つかりません' });
    }

    // Validation
    if (!fullName || fullName.trim().length === 0) {
      return res.status(400).json({ message: '氏名を入力してください' });
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: '有効なメールアドレスを入力してください' });
    }

    // Check if email already exists (except current user)
    const existingUser = await User.findOne({ 
      where: { 
        email: email.toLowerCase() 
      } 
    });

    if (existingUser && existingUser.user_id !== userId) { // FIXED: Compare user_id
      return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
    }

    // Find and update user - FIXED: Use findByPk with userId
    const user = await User.findByPk(userId);
    
    console.log('User found for update:', user ? 'YES' : 'NO'); // Debug
    
    if (!user) {
      console.error('User not found for ID:', userId);
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    // Delete old avatar if new one is provided and it's a local file
    if (avatar && user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldAvatarPath = path.join(__dirname, '../../', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        try {
          fs.unlinkSync(oldAvatarPath);
        } catch (err) {
          console.error('Error deleting old avatar:', err);
        }
      }
    }

    // Update user data
    user.fullName = fullName.trim();
    user.email = email.toLowerCase().trim();
    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    user.updatedAt = new Date();

    await user.save();

    console.log('Profile updated successfully for user_id:', userId); // Debug

    res.json({
      message: 'プロフィールを更新しました',
      user: {
        id: user.user_id, // FIXED: Map user_id to id
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        authType: user.authType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật profile:', error);
    console.error('Error stack:', error.stack); // Debug
    res.status(500).json({ message: 'Lỗi server khi cập nhật profile' });
  }
};

// POST: Upload avatar
exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'ファイルがアップロードされませんでした' });
      }

      // Generate avatar URL
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Optionally update user's avatar in database immediately
      const user = await User.findByPk(req.user.id);
      if (user) {
        // Delete old avatar if exists
        if (user.avatar && user.avatar.startsWith('/uploads/')) {
          const oldAvatarPath = path.join(__dirname, '../../', user.avatar);
          if (fs.existsSync(oldAvatarPath)) {
            try {
              fs.unlinkSync(oldAvatarPath);
            } catch (err) {
              console.error('Error deleting old avatar:', err);
            }
          }
        }

        user.avatar = avatarUrl;
        user.updatedAt = new Date();
        await user.save();
      }

      res.json({
        message: 'アバターをアップロードしました',
        avatarUrl: avatarUrl,
        file: {
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });

    } catch (error) {
      console.error('Lỗi khi upload avatar:', error);
      
      // Delete uploaded file if error occurs
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error('Error deleting file after error:', err);
        }
      }

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'ファイルサイズは5MB以下にしてください' });
        }
        return res.status(400).json({ message: `アップロードエラー: ${error.message}` });
      }
      
      res.status(500).json({ message: error.message || 'Lỗi server khi upload avatar' });
    }
  }
];

// DELETE: Delete avatar
exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    // Delete avatar file if it's a local file
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const avatarPath = path.join(__dirname, '../../', user.avatar);
      if (fs.existsSync(avatarPath)) {
        try {
          fs.unlinkSync(avatarPath);
        } catch (err) {
          console.error('Error deleting avatar file:', err);
        }
      }
    }

    // Remove avatar from database
    user.avatar = null;
    user.updatedAt = new Date();
    await user.save();

    res.json({
      message: 'アバターを削除しました',
      user: {
        user_id: user.user_id, // FIXED: Use user_id
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        authType: user.authType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Lỗi khi xóa avatar:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa avatar' });
  }
};

module.exports = exports;