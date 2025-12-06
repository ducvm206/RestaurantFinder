// server/src/controllers/profileController.js
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user?.user_id || req.user?.id || 'unknown';
    console.log('📸 Uploading avatar for user ID:', userId);
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `user-${userId}-${uniqueSuffix}${ext}`);
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

// Helper function to get full avatar URL
const getFullAvatarUrl = (req, avatarPath) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('http')) return avatarPath;
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}${avatarPath}`;
};

// GET: Lấy thông tin profile
exports.getProfile = async (req, res) => {
  try {
    console.log('👤 User object in getProfile:', req.user);
    
    const userId = req.user?.user_id || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'ユーザーIDが見つかりません' 
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりません' 
      });
    }

    // Get full avatar URL
    const avatarUrl = getFullAvatarUrl(req, user.avatar);

    const responseData = {
      id: user.user_id,
      user_id: user.user_id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,              // Original path
      avatarUrl: avatarUrl,             // Full URL for frontend
      authType: user.authType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    console.log('📊 Profile data to return:', responseData);

    res.status(200).json({
      success: true,
      message: 'プロフィール情報を取得しました',
      user: responseData
    });
    
  } catch (error) {
    console.error('❌ Error in getProfile:', error);
    res.status(500).json({ 
      success: false,
      message: 'サーバーエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT: Cập nhật thông tin profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    
    const userId = req.user?.user_id || req.user?.id;
    
    console.log('✏️ Updating profile for user ID:', userId);
    console.log('📝 Update data:', { fullName, email });
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'ユーザーIDが見つかりません' 
      });
    }

    // Validation
    if (!fullName || fullName.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: '氏名を入力してください' 
      });
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ 
        success: false,
        message: '有効なメールアドレスを入力してください' 
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      console.error('❌ User not found for ID:', userId);
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりません' 
      });
    }

    // Check if email already exists (except current user)
    const existingUser = await User.findOne({ 
      where: { 
        email: email.toLowerCase() 
      } 
    });

    if (existingUser && existingUser.user_id !== userId) {
      return res.status(400).json({ 
        success: false,
        message: 'このメールアドレスは既に使用されています' 
      });
    }

    // Update user data
    user.fullName = fullName.trim();
    user.email = email.toLowerCase().trim();
    user.updatedAt = new Date();

    await user.save();

    console.log('✅ Profile updated successfully for user ID:', userId);

    // Get full avatar URL
    const avatarUrl = getFullAvatarUrl(req, user.avatar);

    res.status(200).json({
      success: true,
      message: 'プロフィールを更新しました',
      user: {
        id: user.user_id,
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,      // Original path
        avatarUrl: avatarUrl,     // Full URL
        authType: user.authType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error in updateProfile:', error);
    res.status(500).json({ 
      success: false,
      message: 'サーバーエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST: Upload avatar
exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      console.log('📤 Upload avatar request:', {
        user: req.user,
        file: req.file
      });
      
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'ファイルがアップロードされませんでした' 
        });
      }

      const userId = req.user?.user_id || req.user?.id;
      
      if (!userId) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ 
          success: false,
          message: 'ユーザーIDが見つかりません' 
        });
      }

      // Generate avatar URL - relative path
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      
      // Get full URL
      const fullAvatarUrl = getFullAvatarUrl(req, avatarPath);

      const user = await User.findByPk(userId);
      
      if (!user) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ 
          success: false,
          message: 'ユーザーが見つかりません' 
        });
      }

      // Delete old avatar if exists
      if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        const oldAvatarPath = path.join(__dirname, '../../', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          try {
            fs.unlinkSync(oldAvatarPath);
            console.log('🗑️ Old avatar deleted:', oldAvatarPath);
          } catch (err) {
            console.error('❌ Error deleting old avatar:', err);
          }
        }
      }

      // Update user's avatar in database
      user.avatar = avatarPath;
      user.updatedAt = new Date();
      await user.save();

      console.log('✅ Avatar uploaded successfully:', {
        userId: userId,
        filename: req.file.filename,
        avatarPath: avatarPath,
        fullAvatarUrl: fullAvatarUrl
      });

      res.status(200).json({
        success: true,
        message: 'アバターをアップロードしました',
        avatar: avatarPath,           // Original path
        avatarUrl: fullAvatarUrl,     // Full URL for frontend
        user: {
          id: user.user_id,
          user_id: user.user_id,
          fullName: user.fullName,
          email: user.email,
          avatar: avatarPath,         // Original path
          avatarUrl: fullAvatarUrl    // Full URL
        }
      });

    } catch (error) {
      console.error('❌ Error in uploadAvatar:', error);
      
      // Delete uploaded file if error occurs
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error('❌ Error deleting file after error:', err);
        }
      }

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            success: false,
            message: 'ファイルサイズは5MB以下にしてください' 
          });
        }
        return res.status(400).json({ 
          success: false,
          message: `アップロードエラー: ${error.message}` 
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: error.message || 'サーバーエラーが発生しました'
      });
    }
  }
];

// DELETE: Delete avatar
exports.deleteAvatar = async (req, res) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'ユーザーIDが見つかりません' 
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりません' 
      });
    }

    if (!user.avatar) {
      return res.status(400).json({ 
        success: false,
        message: '削除するアバターがありません' 
      });
    }

    // Delete avatar file if it's a local file
    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const avatarPath = path.join(__dirname, '../../', user.avatar);
      if (fs.existsSync(avatarPath)) {
        try {
          fs.unlinkSync(avatarPath);
          console.log('🗑️ Avatar file deleted:', avatarPath);
        } catch (err) {
          console.error('❌ Error deleting avatar file:', err);
        }
      }
    }

    // Remove avatar from database
    user.avatar = null;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'アバターを削除しました',
      user: {
        id: user.user_id,
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        avatar: null,
        avatarUrl: null,
        authType: user.authType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error in deleteAvatar:', error);
    res.status(500).json({ 
      success: false,
      message: 'サーバーエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = exports;