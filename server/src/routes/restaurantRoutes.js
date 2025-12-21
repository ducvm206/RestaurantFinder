// server/src/routes/restaurantRoutes.js
const express = require("express");
const { getAllRestaurants, getRestaurantById, searchRestaurants, getRestaurantsByDish } = require("../controllers/restaurantController");

const router = express.Router();

router.get("/search/q", searchRestaurants);
// GET all restaurants
router.get("/", getAllRestaurants);          // /api/restaurants
router.get("/by-dish", getRestaurantsByDish);
// GET restaurant by ID
router.get("/:id", getRestaurantById);       // /api/restaurants/:id

module.exports = router; // CommonJS
