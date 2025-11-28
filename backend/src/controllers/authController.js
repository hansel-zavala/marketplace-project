// src/controllers/authController.js
const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const newUser = await authService.registerUser(req.body);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                uuid: newUser.uuid,
                email: newUser.email,
                full_name: `${newUser.first_name} ${newUser.last_name}`
            }
        });
    } catch (error) {
        console.error(error);
        if (error.message === 'El correo ya está registrado') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { user, token } = await authService.loginUser(email, password);

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                uuid: user.uuid,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                user_type: user.user_type,
                phone: user.phone,
                created_at: user.created_at,
                profile_image: user.profile_image
            }
        });
    } catch (error) {
        console.error(error);
        if (error.message === 'Credenciales inválidas') {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getProfile = async (req, res) => {
    try {
        res.json({
            message: 'Perfil de usuario obtenido',
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo perfil' });
    }
};

module.exports = {
    register,
    login,
    getProfile
};