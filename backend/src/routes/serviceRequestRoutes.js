const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceRequestController');
const { auth } = require('../middleware/authMiddleware');
const { validateServiceRequest, validateStatusUpdate } = require('../validators/serviceRequestValidator');

router.use(auth);

router.post('/', validateServiceRequest, controller.create);

router.get('/client', controller.getMyRequestsAsClient);

router.get('/professional', controller.getMyRequestsAsProfessional);

router.put('/:id/status', validateStatusUpdate, controller.updateStatus);

module.exports = router;