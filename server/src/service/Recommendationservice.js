// server/src/services/recommendationService.js
const { Op } = require("sequelize");
const {
  User,
  Restaurant,
  Review,
  SearchHistory,
  Favorite,
  Recommendation,
} = require("../models");

class RecommendationService {
  /**
   * Tạo gợi ý nhà hàng cho user dựa trên:
   * - Lịch sử tìm kiếm
   * - Lịch sử đánh giá
   * - Danh sách yêu thích
   * - Xu hướng phổ biến
   */
  async generateRecommendations(userId, limit = 10) {
    try {
      // 1. Lấy thông tin user
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User không tồn tại");
      }

      // 2. Thu thập dữ liệu phân tích
      const [searchHistory, userReviews, userFavorites] = await Promise.all([
        this.getUserSearchHistory(userId),
        this.getUserReviews(userId),
        this.getUserFavorites(userId),
      ]);

      // 3. Phân tích sở thích user
      const preferences = this.analyzeUserPreferences(
        searchHistory,
        userReviews,
        userFavorites
      );

      // 4. Lấy tất cả nhà hàng (trừ những nhà hàng user đã tương tác)
      const excludeRestaurantIds = [
        ...userFavorites.map((f) => f.restaurant_id),
        ...userReviews.map((r) => r.restaurant_id),
      ];

      const candidateRestaurants = await Restaurant.findAll({
        where: {
          restaurant_id: {
            [Op.notIn]:
              excludeRestaurantIds.length > 0 ? excludeRestaurantIds : [0],
          },
        },
        include: [
          {
            model: Review,
            as: "reviews",
            attributes: ["rating"],
          },
        ],
      });

      // 5. Tính điểm cho từng nhà hàng
      const scoredRestaurants = candidateRestaurants.map((restaurant) => {
        const score = this.calculateRecommendationScore(
          restaurant,
          preferences
        );
        const reason = this.generateReason(restaurant, preferences);

        return {
          restaurant,
          score,
          reason,
        };
      });

      // 6. Sắp xếp theo điểm và lấy top
      const topRecommendations = scoredRestaurants
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // 7. Lưu vào database
      await this.saveRecommendations(userId, topRecommendations);

      // 8. Trả về kết quả
      return topRecommendations.map((item) => ({
        restaurant_id: item.restaurant.restaurant_id,
        name: item.restaurant.name,
        description: item.restaurant.description,
        image_url: item.restaurant.image_url,
        address_ja: item.restaurant.address_ja,
        district: item.restaurant.district,
        city: item.restaurant.city,
        average_rating: item.restaurant.average_rating,
        total_reviews: item.restaurant.total_reviews,
        price_range: item.restaurant.price_range,
        score: item.score,
        reason: item.reason,
      }));
    } catch (error) {
      console.error("Lỗi khi tạo gợi ý:", error);
      throw error;
    }
  }

  /**
   * Lấy lịch sử tìm kiếm gần đây của user (5 gần nhất)
   */
  async getUserSearchHistory(userId) {
    return await SearchHistory.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit: 5,
    });
  }

  /**
   * Lấy reviews của user (chỉ lấy rating >= 4)
   */
  async getUserReviews(userId) {
    return await Review.findAll({
      where: {
        user_id: userId,
        rating: { [Op.gte]: 4 },
      },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["restaurant_id", "district", "price_range"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 10,
    });
  }

  /**
   * Lấy danh sách yêu thích của user
   */
  async getUserFavorites(userId) {
    return await Favorite.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["restaurant_id", "district", "price_range"],
        },
      ],
    });
  }

  /**
   * Phân tích sở thích của user
   */
  analyzeUserPreferences(searchHistory, userReviews, userFavorites) {
    const preferences = {
      keywords: [],
      districts: {},
      priceRanges: {},
    };

    // Phân tích từ khóa từ lịch sử tìm kiếm
    searchHistory.forEach((search) => {
      if (search.search_query) {
        preferences.keywords.push(search.search_query.toLowerCase());
      }

      // Phân tích filters
      if (search.filters_json) {
        if (search.filters_json.district) {
          preferences.districts[search.filters_json.district] =
            (preferences.districts[search.filters_json.district] || 0) + 1;
        }
        if (search.filters_json.price_range) {
          preferences.priceRanges[search.filters_json.price_range] =
            (preferences.priceRanges[search.filters_json.price_range] || 0) + 1;
        }
      }
    });

    // Phân tích từ reviews
    userReviews.forEach((review) => {
      if (review.restaurant) {
        if (review.restaurant.district) {
          preferences.districts[review.restaurant.district] =
            (preferences.districts[review.restaurant.district] || 0) + 2; // Trọng số cao hơn
        }
        if (review.restaurant.price_range) {
          preferences.priceRanges[review.restaurant.price_range] =
            (preferences.priceRanges[review.restaurant.price_range] || 0) + 2;
        }
      }
    });

    // Phân tích từ favorites
    userFavorites.forEach((favorite) => {
      if (favorite.restaurant) {
        if (favorite.restaurant.district) {
          preferences.districts[favorite.restaurant.district] =
            (preferences.districts[favorite.restaurant.district] || 0) + 3; // Trọng số cao nhất
        }
        if (favorite.restaurant.price_range) {
          preferences.priceRanges[favorite.restaurant.price_range] =
            (preferences.priceRanges[favorite.restaurant.price_range] || 0) + 3;
        }
      }
    });

    return preferences;
  }

  /**
   * Tính điểm gợi ý cho nhà hàng
   */
  calculateRecommendationScore(restaurant, preferences) {
    let score = 0;

    // 1. Điểm từ từ khóa tìm kiếm (10 điểm mỗi từ khớp)
    preferences.keywords.forEach((keyword) => {
      if (restaurant.name.toLowerCase().includes(keyword)) {
        score += 10;
      }
      if (
        restaurant.description &&
        restaurant.description.toLowerCase().includes(keyword)
      ) {
        score += 5;
      }
    });

    // 2. Điểm từ khu vực (15 điểm nếu khớp với khu vực yêu thích)
    if (restaurant.district && preferences.districts[restaurant.district]) {
      score += 15 * preferences.districts[restaurant.district];
    }

    // 3. Điểm từ mức giá (10 điểm nếu khớp với mức giá yêu thích)
    if (
      restaurant.price_range &&
      preferences.priceRanges[restaurant.price_range]
    ) {
      score += 10 * preferences.priceRanges[restaurant.price_range];
    }

    // 4. Điểm từ rating trung bình (5 điểm nếu >= 4.5)
    if (restaurant.average_rating >= 4.5) {
      score += 5;
    } else if (restaurant.average_rating >= 4.0) {
      score += 3;
    }

    // 5. Điểm từ số lượng reviews (3 điểm nếu >= 50)
    if (restaurant.total_reviews >= 50) {
      score += 3;
    } else if (restaurant.total_reviews >= 20) {
      score += 2;
    }

    // 6. Điểm ngẫu nhiên nhỏ để tạo đa dạng (0-2 điểm)
    score += Math.random() * 2;

    return Math.round(score * 10) / 10; // Làm tròn 1 chữ số
  }

  /**
   * Tạo lý do gợi ý
   */
  generateReason(restaurant, preferences) {
    const reasons = [];

    // Kiểm tra từ khóa
    const matchedKeyword = preferences.keywords.find((keyword) =>
      restaurant.name.toLowerCase().includes(keyword)
    );
    if (matchedKeyword) {
      reasons.push(`Khớp với từ khóa tìm kiếm "${matchedKeyword}"`);
    }

    // Kiểm tra khu vực
    if (restaurant.district && preferences.districts[restaurant.district]) {
      reasons.push(`Cùng khu vực ${restaurant.district} bạn thường tìm`);
    }

    // Kiểm tra mức giá
    if (
      restaurant.price_range &&
      preferences.priceRanges[restaurant.price_range]
    ) {
      reasons.push(`Phù hợp với mức giá ${restaurant.price_range} bạn thích`);
    }

    // Kiểm tra rating
    if (restaurant.average_rating >= 4.5) {
      reasons.push(`Đánh giá cao (${restaurant.average_rating}⭐)`);
    }

    // Kiểm tra popularity
    if (restaurant.total_reviews >= 50) {
      reasons.push(`Phổ biến với ${restaurant.total_reviews} đánh giá`);
    }

    // Nếu không có lý do cụ thể
    if (reasons.length === 0) {
      reasons.push("Gợi ý dựa trên sở thích của bạn");
    }

    return reasons.join(", ");
  }

  /**
   * Lưu recommendations vào database
   */
  async saveRecommendations(userId, topRecommendations) {
    try {
      // Xóa recommendations cũ của user (giữ lại trong 7 ngày)
      await Recommendation.destroy({
        where: {
          user_id: userId,
          created_at: {
            [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      // Lưu recommendations mới
      const recommendationsData = topRecommendations.map((item, index) => ({
        user_id: userId,
        restaurant_id: item.restaurant.restaurant_id,
        recommendation_type: "personalized",
        score: item.score,
        reason: item.reason,
      }));

      await Recommendation.bulkCreate(recommendationsData, {
        updateOnDuplicate: ["score", "reason", "created_at"],
      });
    } catch (error) {
      console.error("Lỗi khi lưu recommendations:", error);
    }
  }

  /**
   * Lấy recommendations đã lưu của user
   */
  async getSavedRecommendations(userId, limit = 10) {
    try {
      const recommendations = await Recommendation.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Restaurant,
            as: "restaurant",
            attributes: [
              "restaurant_id",
              "name",
              "description",
              "image_url",
              "address_ja",
              "district",
              "city",
              "average_rating",
              "total_reviews",
              "price_range",
            ],
          },
        ],
        order: [["score", "DESC"]],
        limit: limit,
      });

      return recommendations.map((rec) => ({
        restaurant_id: rec.restaurant.restaurant_id,
        name: rec.restaurant.name,
        description: rec.restaurant.description,
        image_url: rec.restaurant.image_url,
        address_ja: rec.restaurant.address_ja,
        district: rec.restaurant.district,
        city: rec.restaurant.city,
        average_rating: rec.restaurant.average_rating,
        total_reviews: rec.restaurant.total_reviews,
        price_range: rec.restaurant.price_range,
        score: rec.score,
        reason: rec.reason,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy saved recommendations:", error);
      throw error;
    }
  }

  /**
   * Lấy nhà hàng phổ biến (trending)
   */
  async getTrendingRestaurants(limit = 10) {
    try {
      const restaurants = await Restaurant.findAll({
        where: {
          average_rating: { [Op.gte]: 4.0 },
          total_reviews: { [Op.gte]: 10 },
        },
        order: [
          ["average_rating", "DESC"],
          ["total_reviews", "DESC"],
        ],
        limit: limit,
      });

      return restaurants.map((restaurant) => ({
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        description: restaurant.description,
        image_url: restaurant.image_url,
        address_ja: restaurant.address_ja,
        district: restaurant.district,
        city: restaurant.city,
        average_rating: restaurant.average_rating,
        total_reviews: restaurant.total_reviews,
        price_range: restaurant.price_range,
        reason: "Nhà hàng phổ biến",
      }));
    } catch (error) {
      console.error("Lỗi khi lấy trending restaurants:", error);
      throw error;
    }
  }
}

module.exports = new RecommendationService();
