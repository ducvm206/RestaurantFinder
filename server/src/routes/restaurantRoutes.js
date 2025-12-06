const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// GET http://localhost:5000/api/restaurants
router.get('/', restaurantController.getAllRestaurants);

module.exports = router;