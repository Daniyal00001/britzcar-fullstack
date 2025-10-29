// backend/routes/auth.js
const router = require('express').Router();
const { login, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Login route
router.post('/login', login);

// Change password route (protected with auth middleware)
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;