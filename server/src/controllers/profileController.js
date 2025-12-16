// server/src/controllers/profileController.js
const User = require('../models/User');
const { uploadAvatar, handleAvatarUploadError } = require('../middleware/avatarUpload');
const path = require('path');
const fs = require('fs');

// =========================================
// GET: Get profile information
// =========================================
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    console.log('🔍 Getting profile for user_id:', user.user_id);

    // Get fresh user data from database
    const freshUser = await User.findByPk(user.user_id);
    
    if (!freshUser) {
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりません' 
      });
    }

    console.log('✅ Fresh user from DB - avatar:', freshUser.avatar);
    
    // 🔥 CRITICAL FIX: Always return the avatar URL from database
    // Don't check if file exists on server - let the frontend handle broken images
    let avatarValue = freshUser.avatar;
    
    // Only validate if it's not empty
    if (!avatarValue || avatarValue.trim() === '') {
      avatarValue = null;
    }
    
    // 🔥 FIX: Ensure consistent format for relative paths
    if (avatarValue && !avatarValue.startsWith('http')) {
      // Ensure it starts with / for relative paths
      if (!avatarValue.startsWith('/')) {
        avatarValue = '/' + avatarValue;
      }
      // For uploaded avatars, ensure they're in the correct format
      if (avatarValue.includes('uploads/avatars') && !avatarValue.startsWith('/uploads/avatars/')) {
        avatarValue = avatarValue.replace('uploads/avatars', '/uploads/avatars');
      }
    }

    console.log('📤 Final avatar to return:', avatarValue);

    res.json({
      success: true,
      message: 'プロフィールを取得しました',
      user: {
        id: freshUser.user_id,
        user_id: freshUser.user_id,
        fullName: freshUser.fullName,
        email: freshUser.email,
        avatar: avatarValue,  // 🔥 Always return the value
        avatarUrl: avatarValue, // 🔥 Same for compatibility
        authType: freshUser.authType,
        createdAt: freshUser.createdAt,
        updatedAt: freshUser.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error in getProfile:', error);
    res.status(500).json({ 
      success: false,
      message: 'サーバーエラーが発生しました'
    });
  }
};

// =========================================
// PUT: Update profile information
// =========================================
// =========================================
// PUT: Update profile information
// =========================================
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, avatar } = req.body;
    
    // Get user_id from req.user (set by authMiddleware)
    const userId = req.user.user_id;
    
    console.log('🔄 Updating profile for user_id:', userId);
    console.log('📝 Update data:', { 
      fullName, 
      email, 
      avatar: avatar ? `provided (${avatar.substring(0, 50)}...)` : 'not provided' 
    });
    
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

    // Check if email already exists (except current user)
    const existingUser = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim() 
      } 
    });

    if (existingUser && existingUser.user_id !== userId) {
      return res.status(400).json({ 
        success: false,
        message: 'このメールアドレスは既に使用されています' 
      });
    }

    // Find user
    const user = await User.findByPk(userId);
    
    console.log('🔍 User found for update:', user ? `YES (ID: ${user.user_id})` : 'NO');
    console.log('📊 Current user data:', {
      currentAvatar: user?.avatar,
      currentEmail: user?.email,
      currentName: user?.fullName
    });
    
    if (!user) {
      console.error('❌ User not found for ID:', userId);
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりません' 
      });
    }

    // Handle avatar logic
    let finalAvatarValue = user.avatar; // Start with current value
    
    if (avatar !== undefined && avatar !== null) {
      console.log('🖼️ Avatar update requested:', avatar);
      
      // Case 1: Avatar is being removed (empty string)
      if (avatar === '') {
        console.log('🗑️ Removing avatar (empty string provided)');
        
        // Delete old avatar file if it exists and is a local file
        if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
          const oldAvatarPath = path.join(__dirname, '../../..', user.avatar);
          console.log('🗑️ Checking old avatar at:', oldAvatarPath);
          
          if (fs.existsSync(oldAvatarPath)) {
            try {
              fs.unlinkSync(oldAvatarPath);
              console.log('✅ Old avatar file deleted');
            } catch (err) {
              console.error('❌ Error deleting old avatar file:', err);
            }
          }
        }
        
        finalAvatarValue = null;
        
      } 
      // Case 2: New avatar path provided
      else if (avatar.trim() !== '') {
        console.log('🖼️ Setting new avatar path:', avatar);
        
        // Delete old avatar if new one is different and old one is a local file
        if (user.avatar && 
            user.avatar.startsWith('/uploads/avatars/') && 
            user.avatar !== avatar) {
          
          const oldAvatarPath = path.join(__dirname, '../../..', user.avatar);
          console.log('🗑️ Checking old avatar at:', oldAvatarPath);
          
          if (fs.existsSync(oldAvatarPath)) {
            try {
              fs.unlinkSync(oldAvatarPath);
              console.log('✅ Old avatar file deleted (replaced with new)');
            } catch (err) {
              console.error('❌ Error deleting old avatar file:', err);
            }
          }
        }
        
        // Normalize the avatar path for storage
        finalAvatarValue = avatar.trim();
        
        // Ensure consistent format for relative paths
        if (finalAvatarValue && !finalAvatarValue.startsWith('http')) {
          // Ensure it starts with / for relative paths
          if (!finalAvatarValue.startsWith('/')) {
            finalAvatarValue = '/' + finalAvatarValue;
          }
          // For uploaded avatars, ensure correct format
          if (finalAvatarValue.includes('uploads/avatars') && 
              !finalAvatarValue.startsWith('/uploads/avatars/')) {
            finalAvatarValue = finalAvatarValue.replace('uploads/avatars', '/uploads/avatars');
          }
        }
        
        console.log('🖼️ Normalized avatar for storage:', finalAvatarValue);
      }
    }
    
    // Update user data
    console.log('💾 Updating user fields...');
    user.fullName = fullName.trim();
    user.email = email.toLowerCase().trim();
    user.avatar = finalAvatarValue;
    user.updatedAt = new Date();

    await user.save();
    
    // Verify the update
    const updatedUser = await User.findByPk(userId);
    console.log('✅ Profile updated successfully');
    console.log('📊 Updated user data:', {
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      updatedAt: updatedUser.updatedAt
    });

    // Prepare response - ensure avatar is in consistent format
    let avatarResponse = updatedUser.avatar;
    
    if (!avatarResponse || avatarResponse.trim() === '') {
      avatarResponse = null;
      console.log('📤 Avatar response: null (empty/removed)');
    } else {
      // Ensure consistent format for response
      if (!avatarResponse.startsWith('http')) {
        if (!avatarResponse.startsWith('/')) {
          avatarResponse = '/' + avatarResponse;
        }
        // For uploaded avatars, ensure correct format
        if (avatarResponse.includes('uploads/avatars') && 
            !avatarResponse.startsWith('/uploads/avatars/')) {
          avatarResponse = avatarResponse.replace('uploads/avatars', '/uploads/avatars');
        }
      }
      console.log('📤 Avatar response:', avatarResponse);
    }

    res.json({
      success: true,
      message: 'プロフィールを更新しました',
      user: {
        id: updatedUser.user_id,
        user_id: updatedUser.user_id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        avatar: avatarResponse,        // 🔥 Consistent format
        avatarUrl: avatarResponse,     // 🔥 Same for compatibility
        authType: updatedUser.authType,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    console.error('❌ Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false,
      message: 'サーバーエラーが発生しました'
    });
  }
};

// =========================================
// POST: Upload avatar
// =========================================
// =========================================
// POST: Upload avatar
// =========================================
exports.uploadAvatar = [
  uploadAvatar,
  handleAvatarUploadError,
  async (req, res) => {
    try {
      console.log('🔄 Starting avatar upload...');
      console.log('👤 User from request:', {
        user_id: req.user?.user_id,
        email: req.user?.email,
        fullName: req.user?.fullName
      });
      
      if (!req.file) {
        console.log('❌ No file uploaded');
        return res.status(400).json({
          success: false,
          message: "ファイルがアップロードされませんでした"
        });
      }

      console.log('📁 File uploaded:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      // ✅ Use helper function to generate consistent avatar URL
      const generateAvatarUrl = (filename) => {
        if (!filename) return null;
        
        // Always return as relative path starting with /
        const url = `/uploads/avatars/${filename}`;
        console.log('🖼️ Generated avatar URL:', url);
        return url;
      };

      // ✅ Validate file actually exists
      const validateAvatarFile = (filename, uploadDir) => {
        if (!filename) return false;
        
        const filePath = path.join(uploadDir, filename);
        const exists = fs.existsSync(filePath);
        
        console.log('🔍 Validating avatar file:', {
          filename,
          filePath,
          exists
        });
        
        return exists;
      };

      const avatarUrl = generateAvatarUrl(req.file.filename);
      
      // Get avatar upload directory
      const avatarUploadDir = path.join(__dirname, '../../..', 'uploads', 'avatars');
      
      // Validate file actually exists
      const fileExists = validateAvatarFile(req.file.filename, avatarUploadDir);
      if (!fileExists) {
        console.error('❌ Uploaded file does not exist at expected path!');
        
        // Clean up any references
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Deleted uploaded file (validation failed)');
        }
        
        return res.status(500).json({
          success: false,
          message: "アップロードしたファイルが見つかりません"
        });
      }

      console.log('🌐 Full access URL:', `http://localhost:5000${avatarUrl}`);
      console.log('✅ File validation passed');

      // Update user in database
      const user = await User.findByPk(req.user.user_id);
      
      if (!user) {
        console.error('❌ User not found for ID:', req.user.user_id);
        
        // Delete uploaded file if user not found
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Deleted uploaded file (user not found)');
        }
        
        return res.status(404).json({
          success: false,
          message: "ユーザーが見つかりません"
        });
      }

      console.log('👤 Found user:', {
        user_id: user.user_id,
        current_avatar: user.avatar,
        email: user.email,
        fullName: user.fullName
      });

      // Delete old avatar if it exists and is a local file
      if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        const oldAvatarPath = path.join(__dirname, '../../..', user.avatar);
        console.log('🗑️ Old avatar path to check:', oldAvatarPath);
        
        if (fs.existsSync(oldAvatarPath)) {
          try {
            fs.unlinkSync(oldAvatarPath);
            console.log('✅ Old avatar deleted');
          } catch (err) {
            console.error('❌ Error deleting old avatar:', err);
          }
        } else {
          console.log('ℹ️ Old avatar file not found (may have been deleted already)');
        }
      }

      // Update user with new avatar
      console.log('💾 Saving user with new avatar...');
      user.avatar = avatarUrl; // Store relative path
      user.updatedAt = new Date();
      
      await user.save();
      
      console.log('✅ User saved successfully with avatar:', avatarUrl);

      // Verify the user was updated
      const updatedUser = await User.findByPk(req.user.user_id);
      console.log('🔍 Verification - user avatar after save:', updatedUser.avatar);

      // Double-check the avatar file still exists
      if (!validateAvatarFile(req.file.filename, avatarUploadDir)) {
        console.error('⚠️ WARNING: Avatar file disappeared after save!');
        // Don't fail the request, but log the issue
      }

      // 🔥 IMPORTANT: Return consistent avatar format
      // Always return as relative path, frontend will convert to full URL
      const responseAvatar = avatarUrl; // Already in /uploads/avatars/filename format
      
      console.log('📤 Response avatar format:', responseAvatar);

      res.json({
        success: true,
        message: "アバターをアップロードしました",
        avatarUrl: responseAvatar,
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        user: {
          id: user.user_id,
          user_id: user.user_id,
          fullName: user.fullName,
          email: user.email,
          avatar: responseAvatar,  // 🔥 Consistent format
          avatarUrl: responseAvatar, // 🔥 Same for compatibility
          authType: user.authType,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

      console.log('✅ Avatar upload completed successfully');

    } catch (error) {
      console.error('❌ Error in uploadAvatar controller:', error);
      console.error('❌ Error stack:', error.stack);
      
      // Delete uploaded file if error occurs
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Deleted uploaded file after error');
        } catch (err) {
          console.error('Error deleting file after error:', err);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message || "サーバーエラーが発生しました"
      });
    }
  }
];

// =========================================
// DELETE: Delete avatar
// =========================================
exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりません' 
      });
    }

    console.log('🗑️ Deleting avatar for user:', {
      user_id: user.user_id,
      current_avatar: user.avatar
    });

    // Delete avatar file if it's a local file
    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const avatarPath = path.join(__dirname, '../../..', user.avatar);
      console.log('📁 Avatar file path:', avatarPath);
      
      if (fs.existsSync(avatarPath)) {
        try {
          fs.unlinkSync(avatarPath);
          console.log('✅ Avatar file deleted from server');
        } catch (err) {
          console.error('❌ Error deleting avatar file:', err);
        }
      } else {
        console.log('ℹ️ Avatar file not found on server (may have been deleted already)');
      }
    }

    // Remove avatar from database
    user.avatar = null;
    user.updatedAt = new Date();
    await user.save();

    console.log('✅ Avatar removed from database');

    res.json({
      success: true,
      message: 'アバターを削除しました',
      user: {
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
    console.error('❌ Error deleting avatar:', error);
    res.status(500).json({ 
      success: false,
      message: 'サーバーエラーが発生しました'
    });
  }
};

module.exports = exports;