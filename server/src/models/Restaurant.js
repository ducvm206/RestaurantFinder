// server/src/models/Restaurant.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Restaurant = sequelize.define(
  "Restaurant",
  {
    restaurant_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_ja: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    opening_hours: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    price_range: {
      type: DataTypes.ENUM("budget", "moderate", "expensive", "luxury"),
      allowNull: true,
    },
    average_price_per_person: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // --- CÁC TRƯỜNG MỚI ĐỂ KHỚP VỚI BỘ LỌC FRONTEND ---
    cuisine: {
      type: DataTypes.STRING, // Ví dụ: 'japanese', 'vietnamese'
      allowNull: true,
    },
    services: {
      type: DataTypes.JSON, // Lưu mảng: ["dine_in", "takeout"]
      defaultValue: [],
    },
    style: {
      type: DataTypes.JSON, // Lưu mảng: ["casual", "family_friendly"]
      defaultValue: [],
    },
    isOpen:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    timestamps: false,
    tableName: "restaurants",
  }
);

module.exports = Restaurant;