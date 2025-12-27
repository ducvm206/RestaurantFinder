const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");

class SearchHistory extends Model {}

SearchHistory.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  query: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
}, {
  sequelize,
  modelName: "SearchHistory",
  tableName: "search_history",
  timestamps: true,
});

module.exports = SearchHistory;
