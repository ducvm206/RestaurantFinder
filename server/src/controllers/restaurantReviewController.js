// ═══════════════════════════════════════════════════════════════
// RESTAURANT REVIEW CONTROLLER
// ═══════════════════════════════════════════════════════════════
const { RestaurantReview, User, Restaurant } = require("../models");
const RestaurantReviewImage = require("../models/RestaurantReviewImage");
const { sequelize } = require("../config/database");

// ═══════════════════════════════════════════════════════════════
// GET ALL REVIEWS FOR A RESTAURANT
// ═══════════════════════════════════════════════════════════════
exports.getRestaurantReviews = async (req, res) => {
  const restaurantId = parseInt(req.params.id);

  try {
    const reviews = await RestaurantReview.findAll({
      where: { restaurant_id: restaurantId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "fullName", "avatar"],
        },
        {
          model: RestaurantReviewImage,
          as: "images",
          attributes: ["image_id", "image_url", "image_order"],
          order: [["image_order", "ASC"]],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Calculate average rating
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
            totalReviews
          ).toFixed(2)
        : 0;

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews,
          averageRating: parseFloat(avgRating),
        },
      },
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({
      success: false,
      message: "レビューの読み込みに失敗しました",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// CREATE NEW REVIEW
// ═══════════════════════════════════════════════════════════════
exports.createReview = async (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const {
    user_id,
    rating,
    comment,
    title,
    visit_date,
    service_tags,
    style_tags,
    dish_tags,
  } = req.body;

  // Validation
  if (!user_id || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: "評価とコメントは必須です",
    });
  }

  if (comment.length < 10) {
    return res.status(400).json({
      success: false,
      message: "コメントは10文字以上入力してください",
    });
  }

  if (comment.length > 500) {
    return res.status(400).json({
      success: false,
      message: "コメントは500文字以内にしてください",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Check if user already reviewed this restaurant
    const existingReview = await RestaurantReview.findOne({
      where: {
        restaurant_id: restaurantId,
        user_id: user_id,
      },
    });

    if (existingReview) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "既にこのレストランをレビュー済みです",
      });
    }

    // Parse tags (if sent as strings, convert to arrays)
    const parseTags = (tags) => {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags;
      try {
        return JSON.parse(tags);
      } catch {
        return [];
      }
    };

    // Create review
    const review = await RestaurantReview.create(
      {
        restaurant_id: restaurantId,
        user_id: user_id,
        rating: parseFloat(rating),
        comment: comment.trim(),
        title: title || null,
        visit_date: visit_date || null,
        service_tags: parseTags(service_tags),
        style_tags: parseTags(style_tags),
        dish_tags: parseTags(dish_tags),
      },
      { transaction }
    );

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => {
        return RestaurantReviewImage.create(
          {
            review_id: review.review_id,
            image_url: `/uploads/reviews/${file.filename}`,
            image_order: index,
          },
          { transaction }
        );
      });

      await Promise.all(imagePromises);
    }

    // Update restaurant average rating
    const allReviews = await RestaurantReview.findAll({
      where: { restaurant_id: restaurantId },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
      allReviews.length;

    await Restaurant.update(
      {
        average_rating: avgRating.toFixed(2),
        total_reviews: allReviews.length,
      },
      {
        where: { restaurant_id: restaurantId },
        transaction,
      }
    );

    await transaction.commit();

    // Fetch created review with associations
    const createdReview = await RestaurantReview.findOne({
      where: { review_id: review.review_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "fullName", "avatar"],
        },
        {
          model: RestaurantReviewImage,
          as: "images",
          attributes: ["image_id", "image_url", "image_order"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "レビューが投稿されました",
      data: createdReview,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error creating review:", err);
    res.status(500).json({
      success: false,
      message: "レビューの投稿に失敗しました",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// DELETE REVIEW
// ═══════════════════════════════════════════════════════════════
exports.deleteReview = async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "認証が必要です",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Find review
    const review = await RestaurantReview.findOne({
      where: { review_id: reviewId },
    });

    if (!review) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "レビューが見つかりません",
      });
    }

    // Check ownership
    if (review.user_id !== user_id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "このレビューを削除する権限がありません",
      });
    }

    const restaurantId = review.restaurant_id;

    // Delete review (images will cascade delete)
    await review.destroy({ transaction });

    // Recalculate restaurant average rating
    const remainingReviews = await RestaurantReview.findAll({
      where: { restaurant_id: restaurantId },
    });

    if (remainingReviews.length > 0) {
      const avgRating =
        remainingReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
        remainingReviews.length;

      await Restaurant.update(
        {
          average_rating: avgRating.toFixed(2),
          total_reviews: remainingReviews.length,
        },
        {
          where: { restaurant_id: restaurantId },
          transaction,
        }
      );
    } else {
      await Restaurant.update(
        {
          average_rating: 0,
          total_reviews: 0,
        },
        {
          where: { restaurant_id: restaurantId },
          transaction,
        }
      );
    }

    await transaction.commit();

    res.json({
      success: true,
      message: "レビューが削除されました",
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error deleting review:", err);
    res.status(500).json({
      success: false,
      message: "レビューの削除に失敗しました",
      error: err.message,
    });
  }
};