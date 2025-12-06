import { Restaurant, MenuItem } from '../models/index.js';

// GET all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET restaurant by ID
export const getRestaurantById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const restaurant = await Restaurant.findOne({
      where: { restaurant_id: id },
      include: [{ model: MenuItem, as: 'menu_items' }],
    });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


