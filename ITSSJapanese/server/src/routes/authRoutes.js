// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, socialLogin } = require('../controllers/authController');

// POST: /api/auth/register
router.post('/register', register);

// POST: /api/auth/login
router.post('/login', login);

// POST: /api/auth/social
router.post('/social', socialLogin);

module.exports = router;