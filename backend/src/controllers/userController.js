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
                user_type: updatedUser.user_type,
                created_at: updatedUser.created_at,
                profile_image: updatedUser.profile_image
            }
        });

    } catch (error) {
        console.error(error);
        const status = error.message === 'Usuario no encontrado' ? 404 : 500;
        res.status(status).json({ message: error.message || 'Error al actualizar perfil' });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }

        const userId = req.user.uuid;
        const filePath = req.file.path.replace(/\\/g, '/');
        await userService.updateUserAvatar(userId, filePath);

        res.json({
            message: 'Foto de perfil actualizada',
            imageUrl: filePath
        });

    } catch (error) {
        console.error(error);
        const status = error.message === 'Usuario no encontrado' ? 404 : 500;
        res.status(status).json({ message: error.message || 'Error al subir imagen' });
    }
};

module.exports = {
    updateProfile,
    uploadAvatar
};