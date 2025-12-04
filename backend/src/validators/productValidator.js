// backend/src/validators/productValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateProduct = [
    body('title')
        .trim()
        .notEmpty().withMessage('El título del producto es obligatorio')
        .isLength({ max: 200 }).withMessage('El título es muy largo'),

    body('price')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

    body('stock')
        .isInt({ min: 0 }).withMessage('El inventario debe ser un número entero positivo'),

    body('condition')
        .optional()
        .isIn(['new', 'used', 'refurbished']).withMessage('Estado del producto inválido'),

    body('description')
        .optional()
        .trim(),

    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateProduct };