// server/src/models/index.js
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');

// Define associations
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurant_id', as: 'menu_items' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

module.exports = { Restaurant, MenuItem };
