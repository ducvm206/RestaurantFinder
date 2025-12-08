// server/src/models/index.js
const { sequelize } = require("../config/database");

// Load model files
const User = require("./User");
const Restaurant = require("./Restaurant");
const Review = require("./Review");
const MenuItem = require("./MenuItem");
const MenuItemReview = require("./MenuItemReview");
const RestaurantReviewImage = require("./RestaurantReviewImage");
const RestaurantReview = require("./RestaurantReview");
const Favorite = require("./Favorite");
const SearchHistory = require("./SearchHistory");
const Recommendation = require("./Recommendation");

// Validate models
const allModels = [
  User, Restaurant, Review, MenuItem, MenuItemReview,
  RestaurantReview,RestaurantReviewImage, Favorite, SearchHistory, Recommendation
];

// Debug: Check if each model is valid
allModels.forEach((m, i) => {
  if (!m || !m.prototype || !m.prototype instanceof Object) {
    console.error("❌ Model at index", i, "is invalid:", m);
  }
  if (!m.getTableName) {
    console.error("❌ Model missing .getTableName():", m);
  }
});

// Setup associations AFTER models are defined
function setupAssociations() {
  // User ↔ Reviews
  User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
  Review.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Restaurant.hasMany(Review, { foreignKey: "restaurant_id", as: "reviews" });
  Review.belongsTo(Restaurant, { foreignKey: "restaurant_id", as: "restaurant" });

  // User ↔ RestaurantReviews
  User.hasMany(RestaurantReview, { foreignKey: "user_id", as: "restaurantReviews" });
  RestaurantReview.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Restaurant.hasMany(RestaurantReview, {
    foreignKey: "restaurant_id",
    as: "restaurantReviews"
  });
  RestaurantReview.belongsTo(Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant"
  });
// ═══ RestaurantReview ↔ RestaurantReviewImage ═══
  RestaurantReview.hasMany(RestaurantReviewImage, {
    foreignKey: "review_id",
    as: "images",
    onDelete: "CASCADE"
  });
  RestaurantReviewImage.belongsTo(RestaurantReview, {
    foreignKey: "review_id",
    as: "review"
  });

  // Restaurant ↔ MenuItem
  Restaurant.hasMany(MenuItem, { foreignKey: "restaurant_id", as: "menuItems" });
  MenuItem.belongsTo(Restaurant, { foreignKey: "restaurant_id", as: "restaurant" });

  // User ↔ MenuItemReview
  User.hasMany(MenuItemReview, { foreignKey: "user_id", as: "menuItemReviews" });
  MenuItemReview.belongsTo(User, { foreignKey: "user_id", as: "user" });

  MenuItem.hasMany(MenuItemReview, { foreignKey: "item_id", as: "reviews" });
  MenuItemReview.belongsTo(MenuItem, { foreignKey: "item_id", as: "menuItem" });

  Restaurant.hasMany(MenuItemReview, {
    foreignKey: "restaurant_id",
    as: "menuItemReviews"
  });
  MenuItemReview.belongsTo(Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant"
  });

  // Favorites (many-to-many)
  User.belongsToMany(Restaurant, {
    through: Favorite,
    foreignKey: "user_id",
    otherKey: "restaurant_id",
    as: "favoriteRestaurants"
  });
  Restaurant.belongsToMany(User, {
    through: Favorite,
    foreignKey: "restaurant_id",
    otherKey: "user_id",
    as: "favoritedByUsers"
  });

  // Search history
  User.hasMany(SearchHistory, { foreignKey: "user_id", as: "searchHistory" });
  SearchHistory.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // Recommendations
  User.hasMany(Recommendation, { foreignKey: "user_id", as: "recommendations" });
  Recommendation.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Restaurant.hasMany(Recommendation, {
    foreignKey: "restaurant_id",
    as: "recommendedTo"
  });
  Recommendation.belongsTo(Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant"
  });
}

// Run association setup
setupAssociations();

// Export models
module.exports = {
  sequelize,
  User,
  Restaurant,
  Review,
  MenuItem,
  MenuItemReview,
  RestaurantReview,
  RestaurantReviewImage,
  Favorite,
  SearchHistory,
  Recommendation
};