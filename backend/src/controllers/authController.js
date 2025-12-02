// src/controllers/authController.js
const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { user, token } = await authService.registerUser(req.body);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                uuid: user.uuid,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_type: user.user_type
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await authService.requestPasswordReset(email);
        
        res.json({ message: 'Si el correo existe, se ha enviado un código.' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Si el correo existe, se ha enviado un código.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;
        await authService.resetPassword(email, code, password);
        
        res.json({ message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message || 'Error al restablecer contraseña' });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        await authService.changePassword(userId, currentPassword, newPassword);

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        const status = error.message === 'La contraseña actual es incorrecta' ? 400 : 500;
        res.status(status).json({ message: error.message || 'Error al cambiar contraseña' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword
};