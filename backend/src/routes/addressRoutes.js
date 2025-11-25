// backend/src/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', addressController.createAddress);

router.get('/', addressController.getMyAddresses);

router.put('/:id', addressController.updateAddress);

router.delete('/:id', addressController.deleteAddress);

module.exports = router;