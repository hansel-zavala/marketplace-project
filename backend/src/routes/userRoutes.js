// backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.put('/profile', auth, userController.updateProfile);

module.exports = router;