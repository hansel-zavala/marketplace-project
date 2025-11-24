// backend/src/controllers/userController.js
const userService = require('../services/userService');

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.uuid;
        const updatedUser = await userService.updateUserProfile(userId, req.body);

        res.json({
            message: 'Perfil actualizado correctamente',
            user: {
                uuid: updatedUser.uuid,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                phone: updatedUser.phone,
                user_type: updatedUser.user_type
            }
        });

    } catch (error) {
        console.error(error);
        const status = error.message === 'Usuario no encontrado' ? 404 : 500;
        res.status(status).json({ message: error.message || 'Error al actualizar perfil' });
    }
};

module.exports = {
    updateProfile
};