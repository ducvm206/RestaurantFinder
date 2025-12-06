// server/src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // Tên hiển thị (Ví dụ: Nguyen Van A)
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Email là định danh duy nhất để đăng nhập
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Null nếu đăng nhập bằng Google/Facebook
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
  // Phân loại tài khoản
  authType: {
    type: DataTypes.ENUM('local', 'google', 'facebook'),
    defaultValue: 'local'
  },
  // ID riêng của Google/Facebook trả về
  authId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = User;