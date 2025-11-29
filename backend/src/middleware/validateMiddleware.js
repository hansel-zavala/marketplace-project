// backend/src/middleware/validateMiddleware.js
const { validationResult } = require('express-validator');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Error de validación',
            errors: errors.array() 
        });
    }
    next();
};

module.exports = { validationMiddleware };