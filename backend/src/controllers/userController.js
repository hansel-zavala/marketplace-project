// backend/src/controllers/userController.js
const User = require('../models/mysql/User');

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.uuid; 
        const { first_name, last_name, phone } = req.body;

        const user = await User.findOne({ where: { uuid: userId } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (phone) user.phone = phone;

        await user.save();

        res.json({
            message: 'Perfil actualizado correctamente',
            user: {
                uuid: user.uuid,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                user_type: user.user_type
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
};

module.exports = {
    updateProfile
};