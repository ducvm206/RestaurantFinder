// server/src/controllers/recommendationController.js
const recommendationService = require("../service/Recommendationservice");

class RecommendationController {
  /**
   * GET /api/recommendations/generate
   * Tạo gợi ý mới cho user
   */
  async generateRecommendations(req, res) {
    try {
      const userId = req.user.user_id; // Lấy từ middleware auth
      const limit = parseInt(req.query.limit) || 10;

      const recommendations =
        await recommendationService.generateRecommendations(userId, limit);

      return res.status(200).json({
        success: true,
        data: recommendations,
        message: "Đã tạo gợi ý thành công",
      });
    } catch (error) {
      console.error("Lỗi generate recommendations:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi tạo gợi ý",
      });
    }
  }

  /**
   * GET /api/recommendations
   * Lấy gợi ý đã lưu của user
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user.user_id;
      const limit = parseInt(req.query.limit) || 10;

      const recommendations =
        await recommendationService.getSavedRecommendations(userId, limit);

      return res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      console.error("Lỗi get recommendations:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi lấy gợi ý",
      });
    }
  }

  /**
   * GET /api/recommendations/trending
   * Lấy nhà hàng đang trending
   */
  async getTrendingRestaurants(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const restaurants = await recommendationService.getTrendingRestaurants(
        limit
      );

      return res.status(200).json({
        success: true,
        data: restaurants,
      });
    } catch (error) {
      console.error("Lỗi get trending:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi lấy trending",
      });
    }
  }

  /**
   * GET /api/recommendations/for-guest
   * Lấy gợi ý cho user chưa đăng nhập (chỉ trending)
   */
  async getRecommendationsForGuest(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const restaurants = await recommendationService.getTrendingRestaurants(
        limit
      );

      return res.status(200).json({
        success: true,
        data: restaurants,
        message: "Đây là các nhà hàng phổ biến",
      });
    } catch (error) {
      console.error("Lỗi get recommendations for guest:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi lấy gợi ý",
      });
    }
  }
}

// Create instance and bind methods
const controller = new RecommendationController();

module.exports = {
  generateRecommendations: controller.generateRecommendations.bind(controller),
  getRecommendations: controller.getRecommendations.bind(controller),
  getTrendingRestaurants: controller.getTrendingRestaurants.bind(controller),
  getRecommendationsForGuest:
    controller.getRecommendationsForGuest.bind(controller),
};
