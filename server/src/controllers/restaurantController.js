// server/src/controllers/restaurantController.js
const { Restaurant, MenuItem, Review, User } = require("../models");
const { Op } = require("sequelize");
const safeArray = (val) => {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  if (typeof val === "string") {
    // comma separated or JSON string
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};


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

// GET restaurants by search & filters
exports.searchRestaurants = async (req, res) => {
  try {
    const {
      q, // name keyword
      district,
      city,
      price_range,
      min_rating,
      services,
      cuisines,
      styles,
    } = req.query;

    const where = {};

    if (q) {
      where.name = { [Op.iLike]: `%${q}%` };
    }
    if (district) where.district = district;
    if (city) where.city = city;
    if (price_range) where.price_range = price_range;
    if (min_rating) where.average_rating = { [Op.gte]: Number(min_rating) };

    // Base filtered list
    let restaurants = await Restaurant.findAll({ where });

    // Further filter on array fields (services, styles) and cuisine
    const serviceFilters = safeArray(services);
    const cuisineFilters = safeArray(cuisines);
    const styleFilters = safeArray(styles);

    restaurants = restaurants.filter((r) => {
      const restServices = safeArray(r.services);
      const restStyles = safeArray(r.style || r.styles);
      const restCuisine = r.cuisine;

      const matchService =
        serviceFilters.length === 0 ||
        restServices.some((s) => serviceFilters.includes(s));

      const matchCuisine =
        cuisineFilters.length === 0 ||
        (restCuisine && cuisineFilters.includes(restCuisine));

      const matchStyle =
        styleFilters.length === 0 ||
        restStyles.some((s) => styleFilters.includes(s));

      return matchService && matchCuisine && matchStyle;
    });

    res.json(restaurants);
  } catch (error) {
    console.error("Search restaurants error:", error);
    res.status(500).json({ message: "Cannot search restaurants" });
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
