const { User } = require("../models/User");

const getMe = async (req, res) => {
  try {
    const user = req.user; // req.user được set bởi authMiddleware
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Cannot get user" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      const avatarUrl = `/uploads/${req.file.filename}`;
      user.avatar = avatarUrl;
      await user.save();
      return res.json(user);
    }

    if (req.body.avatar) {
      user.avatar = req.body.avatar;
      await user.save();
      return res.json(user);
    }

    return res.status(400).json({ message: "No avatar provided" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cannot update avatar" });
  }
};

module.exports = { getMe, updateAvatar };
