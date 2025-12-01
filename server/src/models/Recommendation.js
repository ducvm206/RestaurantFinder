// server/src/models/Recommendation.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Recommendation = sequelize.define(
  "Recommendation",
  {
    recommendation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    recommendation_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "recommendations",
    createdAt: "created_at",
    updatedAt: false,
  }
);

// Thêm field expires_at nếu cần
Recommendation.prototype.expires_at = null;

module.exports = Recommendation;
