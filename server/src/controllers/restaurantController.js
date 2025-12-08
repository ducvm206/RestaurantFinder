// server/src/controllers/restaurantController.js
const { Restaurant, MenuItem, Review, User } = require("../models");


// GET all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET restaurant by ID
exports.getRestaurantById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const restaurant = await Restaurant.findOne({
      where: { restaurant_id: id },
      include: [
        { model: MenuItem, as: 'menuItems' },
        {
          model: Review,
          as: 'reviews',
          limit: 3, // show only 3 reviews in detail page
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['user_id', 'fullName', 'avatar']
            }
          ]
        }
      ],
    });

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
