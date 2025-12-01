// server/src/models/RestaurantReview.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const RestaurantReview = sequelize.define(
  "RestaurantReview",
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "restaurants",
        key: "restaurant_id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "user_id",
      },
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    food_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    service_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    atmosphere_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    value_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    cleanliness_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
  },
  {
    timestamps: true,
    tableName: "restaurant_reviews",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = RestaurantReview;
