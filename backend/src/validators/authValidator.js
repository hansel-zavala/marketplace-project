// backend/src/validators/authValidator.js
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validateMiddleware');

const validateRegister = [
    body('first_name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 letras'),
    
    body('last_name')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio'),

    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Formato de correo inválido'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('user_type')
        .optional()
        .isIn(['customer', 'professional', 'business']).withMessage('Tipo de usuario inválido'),

    body('phone')
        .optional()
        .isMobilePhone().withMessage('Número de teléfono inválido'),

    (req, res, next) => validationMiddleware(req, res, next)
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Formato de correo inválido'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    (req, res, next) => validationMiddleware(req, res, next)
];

const validateForgotPassword = [
    body('email').isEmail().withMessage('Correo inválido'),
    (req, res, next) => validationMiddleware(req, res, next)
];

const validateResetPassword = [
    body('email').isEmail().withMessage('Correo inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('El código debe ser de 6 dígitos'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => validationMiddleware(req, res, next)
];

module.exports = { validateRegister, validateLogin, validateForgotPassword, validateResetPassword };