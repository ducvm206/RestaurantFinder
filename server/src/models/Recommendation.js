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
    expires_at: {
      type: DataTypes.DATE,
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

module.exports = Recommendation;
