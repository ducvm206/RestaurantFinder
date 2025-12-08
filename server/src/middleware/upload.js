// ═══════════════════════════════════════════════════════════════
// UPLOAD MIDDLEWARE - IMAGE UPLOAD FOR REVIEWS
// ═══════════════════════════════════════════════════════════════
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads/reviews");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads/reviews directory");
}

// ═══════════════════════════════════════════════════════════════
// STORAGE CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

// ═══════════════════════════════════════════════════════════════
// FILE FILTER - ONLY IMAGES
// ═══════════════════════════════════════════════════════════════
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("画像ファイルのみアップロード可能です (jpg, png, gif, webp)"));
  }
};

// ═══════════════════════════════════════════════════════════════
// MULTER CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3, // Max 3 files
  },
});

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE: UPLOAD MULTIPLE IMAGES
// ═══════════════════════════════════════════════════════════════
const uploadMultiple = upload.array("images", 3);

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLER MIDDLEWARE
// ═══════════════════════════════════════════════════════════════
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "ファイルサイズは5MB以下にしてください",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "画像は3枚までアップロード可能です",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  next();
};

module.exports = {
  uploadMultiple,
  handleUploadError,
};