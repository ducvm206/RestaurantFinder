// server/src/routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/Recommendationcontroller");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   GET /api/recommendations/generate
 * @desc    Tạo gợi ý mới cho user (yêu cầu đăng nhập)
 * @access  Private
 */
router.get(
  "/generate",
  protect,
  recommendationController.generateRecommendations
);

/**
 * @route   GET /api/recommendations
 * @desc    Lấy gợi ý đã lưu của user (yêu cầu đăng nhập)
 * @access  Private
 */
router.get("/", protect, recommendationController.getRecommendations);

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
