// backend/src/validators/addressValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateAddress = [
    body('street_address')
        .trim()
        .notEmpty().withMessage('La dirección exacta es obligatoria'),

    body('city')
        .trim()
        .notEmpty().withMessage('La ciudad es obligatoria'),

    body('state')
        .trim()
        .notEmpty().withMessage('El departamento es obligatorio'),

    body('postal_code')
        .trim()
        .notEmpty().withMessage('El código postal es obligatorio'),

    body('address_type')
        .optional()
        .isIn(['shipping', 'billing', 'service']).withMessage('Tipo de dirección inválido'),

    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateAddress };