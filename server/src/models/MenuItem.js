// server/src/models/MenuItem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MenuItem = sequelize.define(
  'MenuItem',
  {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    restaurant_id: { type: DataTypes.BIGINT, allowNull: false },
    item_name: { type: DataTypes.STRING(200), allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING(500) },
    category: { type: DataTypes.STRING(100) },
    is_recommended: { type: DataTypes.BOOLEAN, defaultValue: false },
    average_rating: { type: DataTypes.DECIMAL(3,2), defaultValue: 0.0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'menu_items', schema: 'public', timestamps: false }
);

module.exports = MenuItem;
