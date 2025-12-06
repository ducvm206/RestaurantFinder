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
    logo: { type: DataTypes.STRING(500) },
    address: { type: DataTypes.STRING(500) },
    latitude: { type: DataTypes.DECIMAL(10,8) },
    longitude: { type: DataTypes.DECIMAL(11,8) },
    district: { type: DataTypes.STRING(100) },
    city: { type: DataTypes.STRING(100) },
    opening_hours: { type: DataTypes.JSON, defaultValue: [] },
    average_rating: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
    total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    images: { type: DataTypes.JSON, defaultValue: [] },
  },
  { tableName: 'restaurants', schema: 'public', timestamps: false }
);

module.exports = Restaurant;
