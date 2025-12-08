const { body } = require("express-validator");

exports.registerValidator = [
  body("fullName").trim().notEmpty().withMessage("Tên không được để trống"),

  body("email").isEmail().withMessage("Email không hợp lệ"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 kí tự")
    .matches(/[A-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ in hoa")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ"),

  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];
