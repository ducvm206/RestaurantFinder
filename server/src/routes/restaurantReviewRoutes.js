const express = require("express");
const { getRestaurantReviews } = require("../controllers/restaurantReviewController");

const router = express.Router();

// GET restaurant reviews by restaurant ID
router.get("/restaurant/:id", getRestaurantReviews);

module.exports = router;
