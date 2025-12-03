const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const { auth } = require('../middleware/authMiddleware');
const { validateProfessionalProfile } = require('../validators/professionalValidator');
const createUploader = require('../middleware/uploadMiddleware');
const uploadDocument = createUploader('documents');

// router.use(auth);

router.get('/me', auth, professionalController.getMyProfile);
router.get('/:id', professionalController.getPublicProfile);
router.post('/', validateProfessionalProfile, auth, professionalController.updateProfile);
router.post('/verification', uploadDocument.single('document'), auth, professionalController.requestVerification);

module.exports = router;