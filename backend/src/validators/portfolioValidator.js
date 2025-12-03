// backend/src/validators/portfolioValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateProject = [
    body('title')
        .trim()
        .notEmpty().withMessage('El título del proyecto es obligatorio')
        .isLength({ max: 100 }).withMessage('El título es muy largo (máx 100 caracteres)'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descripción es muy larga'),

    body('category')
        .optional()
        .trim(),

    body('completedAt')
        .optional()
        .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),

    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateProject };