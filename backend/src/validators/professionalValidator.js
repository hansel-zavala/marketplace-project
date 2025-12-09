// backend/src/validators/professionalValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateProfessionalProfile = [
    body('profession')
        .trim()
        .notEmpty().withMessage('La profesión u oficio es obligatorio')
        .isLength({ min: 3 }).withMessage('La profesión debe ser real'),

    body('fee')
        .optional()
        .isFloat({ min: 0 }).withMessage('La tarifa debe ser un número positivo'),

    body('billing_type')
        .optional()
        .isIn(['hourly', 'daily', 'job']).withMessage('Tipo de cobro inválido'),

    body('department')
        .notEmpty().withMessage('El departamento es obligatorio'),

    body('municipality')
        .notEmpty().withMessage('El municipio es obligatorio'),

    body('business_name')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('El nombre del negocio es muy corto'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('La biografía no puede exceder 500 caracteres'),

    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateProfessionalProfile };