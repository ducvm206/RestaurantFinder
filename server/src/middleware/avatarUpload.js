// server/src/middleware/avatarUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure avatar upload directory exists
const avatarUploadDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
  console.log("✅ Created uploads/avatars directory:", avatarUploadDir);
}

// Avatar storage configuration
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Avatar upload destination:', avatarUploadDir);
    cb(null, avatarUploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: user-userId-timestamp.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Use user_id from authenticated user
    const userId = req.user?.user_id || 'unknown';
    
    // Clean up the filename (remove special characters, spaces)
    const cleanOriginalName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-\.]/g, '');
    
    const filename = `user-${userId}-${uniqueSuffix}${ext}`;
    
    console.log('📝 Generated avatar filename:', filename, 'from original:', file.originalname);
    cb(null, filename);
  },
});

// Avatar file filter
const avatarFileFilter = (req, file, cb) => {
  console.log('🔍 Filtering file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });
  
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    console.log('✅ File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('❌ File rejected:', file.originalname, 'MimeType:', file.mimetype);
    cb(new Error("画像ファイルのみアップロード可能です (JPEG, PNG, GIF, WebP)"));
  }
};

// Avatar upload configuration
const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Only one file
  },
});

// Single avatar upload middleware
const uploadAvatar = avatarUpload.single("avatar");

// Error handler for avatar uploads
const handleAvatarUploadError = (err, req, res, next) => {
  console.error('❌ Avatar upload middleware error:', {
    message: err.message,
    code: err.code,
    stack: err.stack
  });
  
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "ファイルサイズは5MB以下にしてください",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "アップロード可能なファイルは1つだけです",
      });
    }
    return res.status(400).json({
      success: false,
      message: `アップロードエラー: ${err.message}`,
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "ファイルアップロード中にエラーが発生しました",
    });
  }
  
  next();
};

// Helper function to generate consistent avatar URL
const generateAvatarUrl = (filename) => {
  if (!filename) return null;
  
  // Always return as relative path starting with /
  const url = `/uploads/avatars/${filename}`;
  console.log('🖼️ Generated avatar URL:', url);
  return url;
};

// Helper to validate file exists before returning URL
const validateAvatarFile = (filename) => {
  if (!filename) return false;
  
  const filePath = path.join(avatarUploadDir, filename);
  const exists = fs.existsSync(filePath);
  
  console.log('🔍 Validating avatar file:', {
    filename,
    filePath,
    exists
  });
  
  return exists;
};

module.exports = {
  uploadAvatar,
  handleAvatarUploadError,
  generateAvatarUrl,
  validateAvatarFile,
  avatarUploadDir // Export for use in controllers
};