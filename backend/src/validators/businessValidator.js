// backend/src/validators/businessValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateBusiness = [
    body('business_name')
        .trim()
        .notEmpty().withMessage('El nombre del negocio es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre es muy corto'),

    body('tax_id')
        .optional()
        .trim(),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Formato de correo inválido'),

    body('phone')
        .optional()
        .trim(),

    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateBusiness };