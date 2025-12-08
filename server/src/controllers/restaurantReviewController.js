const { RestaurantReview, User } = require("../models");

// GET all reviews for a restaurant, including user's avatar and name
exports.getRestaurantReviews = async (req, res) => {
  const restaurantId = parseInt(req.params.id);

  try {
    const reviews = await RestaurantReview.findAll({
      where: { restaurant_id: restaurantId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "fullName", "avatar"], // include avatar
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
