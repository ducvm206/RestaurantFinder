// server/src/routes/restaurantRoutes.js
const express = require("express");
const { getAllRestaurants, getRestaurantById } = require("../controllers/restaurantController");

const router = express.Router();

// GET all restaurants
router.get("/", getAllRestaurants);          // /api/restaurants
// GET restaurant by ID
router.get("/:id", getRestaurantById);       // /api/restaurants/:id

module.exports = router; // CommonJS
