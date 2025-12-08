// ═══════════════════════════════════════════════════════════════
// MODEL: RestaurantReviewImage
// ═══════════════════════════════════════════════════════════════
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const RestaurantReviewImage = sequelize.define(
  "RestaurantReviewImage",
  {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "restaurant_reviews",
        key: "review_id",
      },
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    image_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "restaurant_review_images",
  }
);

module.exports = RestaurantReviewImage;