// backend/src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { auth } = require('../middleware/authMiddleware');
const createUploader = require('../middleware/uploadMiddleware');
const { validateProject } = require('../validators/portfolioValidator');

const upload = createUploader('portfolio');

router.get('/:professionalId', portfolioController.getPortfolio);

router.use(auth);

router.post('/', upload.array('photos', 5), validateProject, portfolioController.createProject);

router.delete('/:id', portfolioController.deleteProject);

module.exports = router;