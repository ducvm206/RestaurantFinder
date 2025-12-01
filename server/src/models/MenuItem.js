// server/src/models/MenuItem.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MenuItem = sequelize.define(
  "MenuItem",
  {
    item_id: {
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
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_recommended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: "menu_items",
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = MenuItem;
