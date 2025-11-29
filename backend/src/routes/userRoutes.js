// backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware');
const createUploader = require('../middleware/uploadMiddleware');
const uploadAvatar = createUploader('profiles');
const { validateProfileUpdate } = require('../validators/userValidator');

router.use(auth);

router.put('/profile', auth, validateProfileUpdate, userController.updateProfile);
router.post('/avatar', auth, uploadAvatar.single('avatar'), userController.uploadAvatar);
module.exports = router;