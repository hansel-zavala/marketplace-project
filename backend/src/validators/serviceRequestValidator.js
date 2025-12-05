// backend/src/validators/serviceRequestValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateServiceRequest = [
    body('professional_id')
        .isInt().withMessage('ID de profesional inválido'),

    body('title')
        .trim()
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 150 }).withMessage('Título muy largo'),

    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria'),

    body('service_date')
        .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)')
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error('La fecha del servicio debe ser futura');
            }
            return true;
        }),

    body('location')
        .trim()
        .notEmpty().withMessage('La ubicación es obligatoria'),

    (req, res, next) => validationMiddleware(req, res, next)
];

const validateStatusUpdate = [
    body('status')
        .isIn(['accepted', 'rejected', 'completed', 'cancelled'])
        .withMessage('Estado inválido'),
    
    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateServiceRequest, validateStatusUpdate };