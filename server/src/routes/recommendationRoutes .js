// server/src/routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /api/recommendations/generate
 * @desc    Tạo gợi ý mới cho user (yêu cầu đăng nhập)
 * @access  Private
 */
router.get(
  "/generate",
  authMiddleware,
  recommendationController.generateRecommendations
);

/**
 * @route   GET /api/recommendations
 * @desc    Lấy gợi ý đã lưu của user (yêu cầu đăng nhập)
 * @access  Private
 */
router.get("/", authMiddleware, recommendationController.getRecommendations);

/**
 * @route   GET /api/recommendations/trending
 * @desc    Lấy nhà hàng đang trending (không cần đăng nhập)
 * @access  Public
 */
router.get("/trending", recommendationController.getTrendingRestaurants);

/**
 * @route   GET /api/recommendations/for-guest
 * @desc    Lấy gợi ý cho khách (không cần đăng nhập)
 * @access  Public
 */
router.get("/for-guest", recommendationController.getRecommendationsForGuest);

module.exports = router;
