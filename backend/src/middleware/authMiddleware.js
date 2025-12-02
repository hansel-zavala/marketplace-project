// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = {
      id: user.id,
      uuid: user.uuid,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_type: user.user_type,
      phone: user.phone,
      created_at: user.created_at,
      profile_image: user.profile_image
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    console.error('Error verificando token:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  auth
};