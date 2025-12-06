// backend/src/validators/orderValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateOrder = [
    body('shipping_address_id')
        .isInt().withMessage('Debes seleccionar una dirección de envío válida'),

    body('items')
        .isArray({ min: 1 }).withMessage('El pedido debe tener al menos un producto'),
    
    body('items.*.product_id')
        .isInt().withMessage('ID de producto inválido'),
    
    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),

    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateOrder };