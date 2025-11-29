// backend/src/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { auth } = require('../middleware/authMiddleware');
const { validateAddress } = require('../validators/addressValidator');

router.use(auth);

router.post('/', validateAddress, addressController.createAddress);
router.get('/', addressController.getMyAddresses);
router.put('/:id', validateAddress, addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;