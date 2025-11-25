const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Lấy tất cả config từ .env
const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT = 5432 // default port
} = process.env;

// Khởi tạo Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,          // Bắt buộc dùng SSL
      rejectUnauthorized: false // Chấp nhận chứng chỉ của Supabase, tránh lỗi khi kết nối trên hotspot
    }
  }
});

// Hàm kết nối DB
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully!');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
