const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "Không có token xác thực" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};
