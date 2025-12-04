// backend/src/routes/businessRoutes.js
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { auth } = require('../middleware/authMiddleware');
const { validateBusiness } = require('../validators/businessValidator');
const createUploader = require('../middleware/uploadMiddleware');

const uploadBusiness = createUploader('businesses');

const uploadFields = uploadBusiness.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]);

router.get('/me', auth, businessController.getMyBusiness);

router.get('/:id', businessController.getPublicBusiness);

router.post(
    '/', 
    auth,
    uploadFields,
    validateBusiness,
    businessController.updateBusiness
);

module.exports = router;