// server/src/models/MenuItemReview.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MenuItemReview = sequelize.define(
  "MenuItemReview",
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "menu_items",
        key: "item_id",
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
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "restaurants",
        key: "restaurant_id",
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
    taste_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    presentation_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    portion_rating: {
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
  },
  {
    timestamps: true,
    tableName: "menu_item_reviews",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = MenuItemReview;
