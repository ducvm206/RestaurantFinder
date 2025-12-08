const express = require("express");
const router = express.Router();
const {
  register,
  login,
  socialLogin,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../utils/validators");

// Route kiểm tra user từ cookie
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/social", socialLogin);
router.post("/logout", logout);

module.exports = router;
