// ═══════════════════════════════════════════════════════════════
// RESTAURANT REVIEW ROUTES
// ═══════════════════════════════════════════════════════════════
const express = require("express");
const router = express.Router();
const {
  getRestaurantReviews,
  createReview,
  deleteReview,
} = require("../controllers/restaurantReviewController");
const { uploadMultiple, handleUploadError } = require("../middleware/upload");

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════

// GET all reviews for a restaurant
router.get("/restaurant/:id", getRestaurantReviews);

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTES (No auth middleware - user already logged in)
// ═══════════════════════════════════════════════════════════════

// CREATE new review (with image upload)
router.post(
  "/restaurant/:id",
  uploadMultiple,
  handleUploadError,
  createReview
);

// DELETE review
router.delete("/:reviewId", deleteReview);

module.exports = router;