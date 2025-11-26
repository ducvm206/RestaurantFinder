// server/src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm tạo Token (Hạn 30 ngày)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- 1. ĐĂNG KÝ (Tài khoản thường) ---
exports.register = async (req, res) => {
  // fullName có thể là tên người dùng nhập, hoặc nếu không nhập thì lấy phần trước @ của email
  const { email, password, fullName } = req.body;
  
  try {
    // Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = await User.create({
      fullName: fullName || email.split('@')[0], // Nếu không nhập tên thì lấy email làm tên
      email,
      password: hashedPassword,
      authType: 'local'
    });

    res.json({
      message: 'Đăng ký thành công',
      token: generateToken(newUser.id),
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

// --- 2. ĐĂNG NHẬP (Tài khoản thường) ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user theo email
    const user = await User.findOne({ where: { email } });

    // Kiểm tra user tồn tại và password có đúng không
    // Lưu ý: Nếu user đăng nhập bằng Google (không có pass) thì user.password sẽ là null -> bcrypt.compare sẽ false
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    res.json({
      message: 'Đăng nhập thành công',
      token: generateToken(user.id),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

// --- 3. ĐĂNG NHẬP SOCIAL (Google & Facebook) ---
// Frontend sẽ gửi thông tin lấy được từ Google/FB về đây
exports.socialLogin = async (req, res) => {
  const { email, name, avatar, authId, authType } = req.body; 
  // authType: 'google' hoặc 'facebook'

  try {
    // Tìm xem email này đã có trong database chưa
    let user = await User.findOne({ where: { email } });

    if (user) {
      // TRƯỜNG HỢP 1: Đã có tài khoản -> Đăng nhập luôn
      
      // (Tùy chọn) Cập nhật lại avatar/tên mới nhất từ Google/FB nếu muốn
      // user.avatar = avatar;
      // await user.save();

      res.json({
        message: `Đăng nhập ${authType} thành công`,
        token: generateToken(user.id),
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar
        }
      });
    } else {
      // TRƯỜNG HỢP 2: Chưa có -> Tự động đăng ký mới
      user = await User.create({
        fullName: name,
        email,
        password: null, // Không cần mật khẩu
        avatar,
        authType: authType,
        authId: authId
      });

      res.json({
        message: `Đăng ký mới bằng ${authType} thành công`,
        token: generateToken(user.id),
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Lỗi đăng nhập bằng ${authType}` });
  }
};