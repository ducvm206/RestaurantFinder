// server/src/routes/restaurantRoutes.js
const express = require("express");
const { getAllRestaurants, getRestaurantById, searchRestaurants } = require("../controllers/restaurantController");

const router = express.Router();

// SEARCH restaurants (đặt trước "/" và "/:id" để không bị nuốt route)
router.get("/search/q", searchRestaurants);  // /api/restaurants/search/q?q=&district=&city=&price_range=&min_rating=
// GET all restaurants
router.get("/", getAllRestaurants);          // /api/restaurants
// GET restaurant by ID
router.get("/:id", getRestaurantById);       // /api/restaurants/:id

module.exports = router; // CommonJS
