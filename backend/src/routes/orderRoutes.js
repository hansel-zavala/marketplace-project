const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/authMiddleware');
const { validateOrder } = require('../validators/orderValidator');

router.use(auth);

router.post('/', validateOrder, orderController.createOrder);
router.get('/', orderController.getOrders);

module.exports = router;