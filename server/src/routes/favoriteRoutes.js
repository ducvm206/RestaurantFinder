const express = require("express");
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");
const { protect } = require("../middleware/authMiddleware");

// Lấy danh sách yêu thích
router.get("/", protect, getFavorites);

// Thêm yêu thích
router.post("/", protect, addFavorite);

// Xóa yêu thích theo restaurant_id
router.delete("/:restaurantId", protect, removeFavorite);

module.exports = router;
