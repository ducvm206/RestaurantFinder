const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Tạo JWT token (hạn 30 ngày)
const generateToken = (user_id) => {
  return jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Set token vào cookie
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user.user_id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // CHO LOCALHOST
    sameSite: "Lax", // CHO LOCALHOST
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.status(statusCode).json({
    message,
    user: {
      id: user.user_id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

// --- ĐĂNG KÝ ---
exports.register = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // Validate mật khẩu
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 6 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt",
      });
    }

    // Check email tồn tại
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = await User.create({
      fullName: fullName || email.split("@")[0],
      email,
      password: hashedPassword,
      authType: "local",
    });

    return sendTokenResponse(newUser, 200, res, "Đăng ký thành công");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// --- ĐĂNG NHẬP ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password)
      return res.status(400).json({ message: "Email hoặc mật khẩu sai" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Email hoặc mật khẩu sai" });

    return sendTokenResponse(user, 200, res, "Đăng nhập thành công");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// --- SOCIAL LOGIN ---
exports.socialLogin = async (req, res) => {
  const { email, name, avatar, authId, authType } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        password: null,
        avatar,
        authType,
        authId,
      });
      return sendTokenResponse(
        user,
        200,
        res,
        `Đăng ký mới bằng ${authType} thành công`
      );
    }

    return sendTokenResponse(
      user,
      200,
      res,
      `Đăng nhập ${authType} thành công`
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi social login" });
  }
};
exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: false, // giống với khi set
    sameSite: "Lax", // giống với khi set
    expires: new Date(0),
    path: "/", // rất quan trọng
  });

  res.json({ message: "Đăng xuất thành công" });
};
