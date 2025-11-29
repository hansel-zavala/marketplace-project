// backend/src/validators/userValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateProfileUpdate = [
    body('first_name')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío'),
    
    body('last_name')
        .optional()
        .trim()
        .notEmpty().withMessage('El apellido no puede estar vacío'),

    body('phone')
        .optional()
        .isLength({ min: 8 }).withMessage('El teléfono parece muy corto'),

    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateProfileUpdate };