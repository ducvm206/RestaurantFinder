const { Favorite, Restaurant } = require("../models");

// GET /api/favorites - list user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: [
            "restaurant_id",
            "name",
            "image_url",
            "district",
            "city",
            "average_rating",
            "price_range",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const formatted = favorites.map((fav) => ({
      favorite_id: fav.favorite_id,
      restaurant_id: fav.restaurant_id,
      notes: fav.notes,
      restaurant: fav.restaurant || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ message: "Không thể lấy danh sách yêu thích" });
  }
};

// POST /api/favorites - save a restaurant as favorite
exports.addFavorite = async (req, res) => {
  const userId = req.user.user_id;
  const { restaurant_id, notes } = req.body;

  if (!restaurant_id) {
    return res
      .status(400)
      .json({ message: "Thiếu restaurant_id trong yêu cầu" });
  }

  try {
    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: "Nhà hàng không tồn tại" });
    }

    const existing = await Favorite.findOne({
      where: { user_id: userId, restaurant_id },
      include: [{ model: Restaurant, as: "restaurant" }],
    });

    if (existing) {
      return res.status(200).json({
        message: "Nhà hàng đã có trong danh sách yêu thích",
        favorite: existing,
      });
    }

    const favorite = await Favorite.create({
      user_id: userId,
      restaurant_id,
      notes: notes || null,
    });

    const withRestaurant = await Favorite.findByPk(favorite.favorite_id, {
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: [
            "restaurant_id",
            "name",
            "image_url",
            "district",
            "city",
            "average_rating",
            "price_range",
          ],
        },
      ],
    });

    res
      .status(201)
      .json({ message: "Đã thêm vào yêu thích", favorite: withRestaurant });
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ message: "Không thể thêm yêu thích" });
  }
};

// DELETE /api/favorites/:restaurantId - remove favorite
exports.removeFavorite = async (req, res) => {
  const userId = req.user.user_id;
  const restaurantId = parseInt(req.params.restaurantId, 10);

  if (!restaurantId) {
    return res
      .status(400)
      .json({ message: "Thiếu restaurantId trong đường dẫn" });
  }

  try {
    const deleted = await Favorite.destroy({
      where: { user_id: userId, restaurant_id: restaurantId },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy yêu thích" });
    }

    res.json({ message: "Đã xóa khỏi yêu thích" });
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ message: "Không thể xóa yêu thích" });
  }
};
