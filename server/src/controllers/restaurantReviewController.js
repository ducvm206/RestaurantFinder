/// ═══════════════════════════════════════════════════════════════
// RESTAURANT REVIEW CONTROLLER - SIMPLIFIED FIXED VERSION
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
    const validReviews = reviews.filter(r => {
      if (r.rating === null || r.rating === undefined) return false;
      const rating = parseFloat(r.rating);
      return !isNaN(rating);
    });
    
    const totalReviews = validReviews.length;
    const avgRating = totalReviews > 0
      ? parseFloat((
          validReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / 
          totalReviews
        ).toFixed(2))
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews,
          averageRating: avgRating,
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
// CREATE NEW REVIEW - SIMPLIFIED FIXED VERSION
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

  const parsedRating = parseFloat(rating);
  if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
    return res.status(400).json({
      success: false,
      message: "評価は0から5の間の数字を入力してください",
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
      transaction,
    });

    if (existingReview) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "既にこのレストランをレビュー済みです",
      });
    }

    // Parse tags
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
        rating: parsedRating,
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

    // 🔴 SIMPLIFIED FIX: Direct subquery without CTE
    const [result] = await sequelize.query(`
      UPDATE restaurants 
      SET 
        total_reviews = (
          SELECT COUNT(*) 
          FROM restaurant_reviews 
          WHERE restaurant_id = :restaurantId
        ),
        average_rating = COALESCE((
          SELECT ROUND(AVG(rating::numeric), 2)
          FROM restaurant_reviews 
          WHERE restaurant_id = :restaurantId
        ), 0.00)
      WHERE restaurant_id = :restaurantId
      RETURNING restaurant_id, average_rating, total_reviews
    `, {
      replacements: { restaurantId },
      type: sequelize.QueryTypes.UPDATE,
      transaction,
    });

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

    // Get updated restaurant stats
    const updatedRestaurant = await Restaurant.findOne({
      where: { restaurant_id: restaurantId },
      attributes: ['average_rating', 'total_reviews'],
      raw: true
    });

    res.status(201).json({
      success: true,
      message: "レビューが投稿されました",
      data: createdReview,
      stats: {
        averageRating: parseFloat(updatedRestaurant.average_rating || 0),
        totalReviews: updatedRestaurant.total_reviews || 0,
      },
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
// DELETE REVIEW - SIMPLIFIED FIXED VERSION
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
      transaction,
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

    // Delete review
    await review.destroy({ transaction });

    // 🔴 SIMPLIFIED FIX: Direct subquery without CTE
    const [result] = await sequelize.query(`
      UPDATE restaurants 
      SET 
        total_reviews = (
          SELECT COUNT(*) 
          FROM restaurant_reviews 
          WHERE restaurant_id = :restaurantId
        ),
        average_rating = COALESCE((
          SELECT ROUND(AVG(rating::numeric), 2)
          FROM restaurant_reviews 
          WHERE restaurant_id = :restaurantId
        ), 0.00)
      WHERE restaurant_id = :restaurantId
      RETURNING restaurant_id, average_rating, total_reviews
    `, {
      replacements: { restaurantId },
      type: sequelize.QueryTypes.UPDATE,
      transaction,
    });

    await transaction.commit();

    res.json({
      success: true,
      message: "レビューが削除されました",
      stats: {
        averageRating: parseFloat(result[0]?.average_rating || 0),
        totalReviews: result[0]?.total_reviews || 0,
      },
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

// ═══════════════════════════════════════════════════════════════
// UPDATE REVIEW - SIMPLIFIED FIXED VERSION
// ═══════════════════════════════════════════════════════════════
exports.updateReview = async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);
  const { user_id, rating, comment, title, service_tags, style_tags, dish_tags } = req.body;

  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "認証が必要です",
    });
  }

  // Validate rating if provided
  if (rating !== undefined) {
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "評価は0から5の間の数字を入力してください",
      });
    }
  }

  if (comment && (comment.length < 10 || comment.length > 500)) {
    return res.status(400).json({
      success: false,
      message: "コメントは10文字以上500文字以内で入力してください",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Find review
    const review = await RestaurantReview.findOne({
      where: { review_id: reviewId },
      transaction,
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
        message: "このレビューを編集する権限がありません",
      });
    }

    const restaurantId = review.restaurant_id;

    // Parse tags
    const parseTags = (tags) => {
      if (!tags) return undefined;
      if (Array.isArray(tags)) return tags;
      try {
        return JSON.parse(tags);
      } catch {
        return [];
      }
    };

    // Update review
    const updateData = {};
    if (rating !== undefined) updateData.rating = parseFloat(rating);
    if (comment !== undefined) updateData.comment = comment.trim();
    if (title !== undefined) updateData.title = title || null;
    if (service_tags !== undefined) updateData.service_tags = parseTags(service_tags);
    if (style_tags !== undefined) updateData.style_tags = parseTags(style_tags);
    if (dish_tags !== undefined) updateData.dish_tags = parseTags(dish_tags);

    await review.update(updateData, { transaction });

    // 🔴 SIMPLIFIED FIX: Direct subquery without CTE
    const [result] = await sequelize.query(`
      UPDATE restaurants 
      SET 
        total_reviews = (
          SELECT COUNT(*) 
          FROM restaurant_reviews 
          WHERE restaurant_id = :restaurantId
        ),
        average_rating = COALESCE((
          SELECT ROUND(AVG(rating::numeric), 2)
          FROM restaurant_reviews 
          WHERE restaurant_id = :restaurantId
        ), 0.00)
      WHERE restaurant_id = :restaurantId
      RETURNING restaurant_id, average_rating, total_reviews
    `, {
      replacements: { restaurantId },
      type: sequelize.QueryTypes.UPDATE,
      transaction,
    });

    await transaction.commit();

    // Fetch updated review with associations
    const updatedReview = await RestaurantReview.findOne({
      where: { review_id: reviewId },
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

    res.json({
      success: true,
      message: "レビューが更新されました",
      data: updatedReview,
      stats: {
        averageRating: parseFloat(result[0]?.average_rating || 0),
        totalReviews: result[0]?.total_reviews || 0,
      },
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating review:", err);
    res.status(500).json({
      success: false,
      message: "レビューの更新に失敗しました",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// FIX ALL RESTAURANT RATINGS (ONE-TIME FIX)
// ═══════════════════════════════════════════════════════════════
exports.fixAllRatings = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const [result] = await sequelize.query(`
      UPDATE restaurants 
      SET 
        total_reviews = (
          SELECT COUNT(*) 
          FROM restaurant_reviews 
          WHERE restaurant_id = restaurants.restaurant_id
        ),
        average_rating = COALESCE((
          SELECT ROUND(AVG(rating::numeric), 2)
          FROM restaurant_reviews 
          WHERE restaurant_id = restaurants.restaurant_id
        ), 0.00)
      WHERE EXISTS (
        SELECT 1 FROM restaurant_reviews 
        WHERE restaurant_id = restaurants.restaurant_id
      )
      RETURNING restaurant_id, average_rating, total_reviews;
    `, {
      type: sequelize.QueryTypes.UPDATE,
      transaction,
    });

    await transaction.commit();
    
    res.json({
      success: true,
      message: `Fixed ${result.length} restaurants`,
      data: result
    });
    
  } catch (err) {
    await transaction.rollback();
    console.error("Error fixing ratings:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fix ratings",
      error: err.message
    });
  }
};