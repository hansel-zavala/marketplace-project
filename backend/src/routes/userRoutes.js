// backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(auth);

router.put('/profile', auth, userController.updateProfile);
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;