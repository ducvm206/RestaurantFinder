const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm tạo Token (Hạn 30 ngày)
const generateToken = (user_id) => {
  console.log('Generating token for user_id:', user_id); // Debug log
  return jwt.sign({ id: user_id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- 1. ĐĂNG KÝ (Tài khoản thường) ---
exports.register = async (req, res) => {
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
      fullName: fullName || email.split('@')[0],
      email,
      password: hashedPassword,
      authType: 'local'
    });

    console.log('New user created - user_id:', newUser.user_id); // Debug

    res.json({
      message: 'Đăng ký thành công',
      token: generateToken(newUser.user_id), // FIXED: Use user_id
      user: {
        id: newUser.user_id, // FIXED: Map user_id to id
        user_id: newUser.user_id, // Also include original
        fullName: newUser.fullName,
        email: newUser.email,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
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
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    console.log('Login successful - user_id:', user.user_id); // Debug

    res.json({
      message: 'Đăng nhập thành công',
      token: generateToken(user.user_id), // FIXED: Use user_id
      user: {
        id: user.user_id, // FIXED: Map user_id to id
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

// --- 3. ĐĂNG NHẬP SOCIAL (Google & Facebook) ---
exports.socialLogin = async (req, res) => {
  const { email, name, avatar, authId, authType } = req.body;

  try {
    // Tìm xem email này đã có trong database chưa
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log('Social login existing user - user_id:', user.user_id); // Debug
      
      res.json({
        message: `Đăng nhập ${authType} thành công`,
        token: generateToken(user.user_id), // FIXED: Use user_id
        user: {
          id: user.user_id, // FIXED: Map user_id to id
          user_id: user.user_id,
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
        password: null,
        avatar,
        authType: authType,
        authId: authId
      });

      console.log('Social login new user - user_id:', user.user_id); // Debug

      res.json({
        message: `Đăng ký mới bằng ${authType} thành công`,
        token: generateToken(user.user_id), // FIXED: Use user_id
        user: {
          id: user.user_id, // FIXED: Map user_id to id
          user_id: user.user_id,
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