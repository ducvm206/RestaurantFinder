// server/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getMe, updateAvatar } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

// Multer để upload file avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET /api/users/me
router.get("/me", protect, getMe);

// PUT /api/users/:id/avatar
router.put("/:id/avatar", protect, upload.single("avatar"), updateAvatar);

module.exports = router;
