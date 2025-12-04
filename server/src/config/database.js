const { Sequelize } = require('sequelize');
const path = require('path');

// Load .env file from server root directory
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('🔧 Loading database config...');
console.log('DB_HOST from env:', process.env.DB_HOST || 'NOT SET');
console.log('DB_USER from env:', process.env.DB_USER || 'NOT SET');

// Get all config from .env with fallbacks
const DB_NAME = process.env.DB_NAME || 'postgres';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

// Validate required fields
if (!DB_PASS) {
  console.error('❌ ERROR: DB_PASS is not set in .env file!');
  console.error('Please add your Supabase database password to .env file');
  process.exit(1);
}

if (!DB_HOST.includes('supabase')) {
  console.warn('⚠️  WARNING: DB_HOST does not look like a Supabase URL');
  console.warn('Expected: db.xxxxx.supabase.co');
  console.warn('Got:', DB_HOST);
}

// Khởi tạo Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: console.log, // Enable logging for debugging
  dialectOptions: {
    ssl: DB_HOST.includes('supabase') ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Hàm kết nối DB
const connectDB = async () => {
  try {
    console.log('🔌 Connecting to database...');
    console.log(`Host: ${DB_HOST}`);
    console.log(`Database: ${DB_NAME}`);
    console.log(`User: ${DB_USER}`);
    
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully!');
    
    // Test query
    const [result] = await sequelize.query('SELECT version()');
    console.log('PostgreSQL version:', result[0].version.substring(0, 50) + '...');
    
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check if .env file exists and has correct values');
    console.error('2. Check Supabase dashboard for correct credentials');
    console.error('3. Check if Supabase project is active');
    console.error('4. Check internet connection');
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
