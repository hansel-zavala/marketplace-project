// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword, validateChangePassword } = require('../validators/authValidator');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', auth, authController.getProfile);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', validateResetPassword, authController.resetPassword);
router.post('/change-password', auth, validateChangePassword, authController.changePassword);

module.exports = router;