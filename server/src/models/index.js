// server/src/models/index.js
const User = require("./User");
const Restaurant = require("./Restaurant");
const Review = require("./Review");
const MenuItem = require("./MenuItem");
const MenuItemReview = require("./MenuItemReview");
const RestaurantReview = require("./RestaurantReview");
const Favorite = require("./Favorite");
const SearchHistory = require("./SearchHistory");
const Recommendation = require("./Recommendation");

// ========================
// RELATIONSHIPS / ASSOCIATIONS
// ========================

// User <-> Restaurant (through Review)
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });

Restaurant.hasMany(Review, { foreignKey: "restaurant_id", as: "reviews" });
Review.belongsTo(Restaurant, { foreignKey: "restaurant_id", as: "restaurant" });

// User <-> Restaurant (through RestaurantReview)
User.hasMany(RestaurantReview, {
  foreignKey: "user_id",
  as: "restaurantReviews",
});
RestaurantReview.belongsTo(User, { foreignKey: "user_id", as: "user" });

Restaurant.hasMany(RestaurantReview, {
  foreignKey: "restaurant_id",
  as: "restaurantReviews",
});
RestaurantReview.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

// Restaurant <-> MenuItem
Restaurant.hasMany(MenuItem, { foreignKey: "restaurant_id", as: "menuItems" });
MenuItem.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

// User <-> MenuItem (through MenuItemReview)
User.hasMany(MenuItemReview, { foreignKey: "user_id", as: "menuItemReviews" });
MenuItemReview.belongsTo(User, { foreignKey: "user_id", as: "user" });

MenuItem.hasMany(MenuItemReview, { foreignKey: "item_id", as: "reviews" });
MenuItemReview.belongsTo(MenuItem, { foreignKey: "item_id", as: "menuItem" });

Restaurant.hasMany(MenuItemReview, {
  foreignKey: "restaurant_id",
  as: "menuItemReviews",
});
MenuItemReview.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

// User <-> Restaurant (through Favorite)
User.hasMany(Favorite, { foreignKey: "user_id", as: "favorites" });
Favorite.belongsTo(User, { foreignKey: "user_id", as: "user" });

Restaurant.hasMany(Favorite, {
  foreignKey: "restaurant_id",
  as: "favoritedBy",
});
Favorite.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

// Many-to-Many: User <-> Restaurant (through Favorite)
User.belongsToMany(Restaurant, {
  through: Favorite,
  foreignKey: "user_id",
  otherKey: "restaurant_id",
  as: "favoriteRestaurants",
});
Restaurant.belongsToMany(User, {
  through: Favorite,
  foreignKey: "restaurant_id",
  otherKey: "user_id",
  as: "favoritedByUsers",
});

// User -> SearchHistory
User.hasMany(SearchHistory, { foreignKey: "user_id", as: "searchHistory" });
SearchHistory.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User <-> Restaurant (through Recommendation)
User.hasMany(Recommendation, { foreignKey: "user_id", as: "recommendations" });
Recommendation.belongsTo(User, { foreignKey: "user_id", as: "user" });

Restaurant.hasMany(Recommendation, {
  foreignKey: "restaurant_id",
  as: "recommendedTo",
});
Recommendation.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

// Export all models
module.exports = {
  User,
  Restaurant,
  Review,
  MenuItem,
  MenuItemReview,
  RestaurantReview,
  Favorite,
  SearchHistory,
  Recommendation,
};
