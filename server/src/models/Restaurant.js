// server/src/models/Restaurant.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Restaurant = sequelize.define(
  'Restaurant',
  {
 restaurant_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100) },
  address_ja: { type: DataTypes.STRING(500) },
  latitude: { type: DataTypes.DECIMAL(10, 8) },
  longitude: { type: DataTypes.DECIMAL(11, 8) },
  district: { type: DataTypes.STRING(100) },
  city: { type: DataTypes.STRING(100) },
  opening_hours: { type: DataTypes.JSONB, defaultValue: {} },
  average_rating: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  image_url: { type: DataTypes.STRING(255) }, // optional main image
  images: { type: DataTypes.JSONB, defaultValue: [] }, // new column for multiple images
  price_range: { type: DataTypes.ENUM('cheap', 'moderate', 'expensive') },
  average_price_per_person: { type: DataTypes.INTEGER },
  cuisine: { type: DataTypes.STRING(200) },
  services: { 
    type: DataTypes.JSONB, 
    defaultValue: [
      "店内飲食",
      "持ち帰り",
      "特典あり",
      "オンライン決済可",
      "日本料理",
      "ベトナム料理"
    ] 
  },
  style: { 
    type: DataTypes.JSONB, 
    defaultValue: [
      "フォーマル",
      "飲み会",
      "家族向け",
      "カジュアル"
    ] 
  },
  isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'restaurants',
    schema: 'public',
    timestamps: false,
  }
);

module.exports = Restaurant;
