const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    // Kết nối database
    await sequelize.authenticate();
    
    // Xóa sạch dữ liệu cũ và tạo lại bảng mới
    await sequelize.sync({ force: true }); 
    
    // Tạo mật khẩu mã hóa
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456', salt);

    // Tạo User Admin mẫu
    await User.create({
      fullName: 'Admin Test',
      email: 'admin@gmail.com',
      password: hash,
      authType: 'local'
    });

    console.log('✅ Đã tạo xong User mẫu: admin@gmail.com / 123456');
    process.exit();
  } catch (err) {
    console.error('❌ Lỗi Seed:', err);
    process.exit(1);
  }
};

seed();