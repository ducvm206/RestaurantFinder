const dotenv = require('dotenv');
dotenv.config();
const { sequelize } = require('./src/config/database');

async function checkData() {
  try {
    await sequelize.authenticate();
    
    // Get raw data to see what's actually stored
    console.log('🔍 Checking actual data in Users table...\n');
    
    const [users] = await sequelize.query(`
      SELECT 
        user_id,
        email,
        "fullName",
        "authType",
        password
      FROM "Users" 
      ORDER BY user_id
    `);
    
    users.forEach(user => {
      console.log(`👤 User ${user.user_id}: ${user.email}`);
      console.log(`   fullName (raw): "${user.fullName}"`);
      console.log(`   Type: ${user.authType}`);
      console.log(`   Has password: ${user.password ? 'YES' : 'NO'}`);
      console.log('');
    });
    
    // Check for NULL or empty fullName
    const nullNames = users.filter(u => !u.fullName || u.fullName.trim() === '');
    console.log(`\n📊 ${nullNames.length} users have NULL or empty fullName:`);
    nullNames.forEach(u => {
      console.log(`   - ID ${u.user_id}: ${u.email}`);
    });
    
    await sequelize.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkData();