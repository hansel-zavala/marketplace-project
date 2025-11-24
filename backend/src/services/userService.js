// backend/src/services/userService.js
const userRepository = require('../repositories/userRepository');

const updateUserProfile = async (uuid, data) => {
    const user = await userRepository.findByUuid(uuid);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const updateData = {};
    if (data.first_name) updateData.first_name = data.first_name;
    if (data.last_name) updateData.last_name = data.last_name;
    if (data.phone) updateData.phone = data.phone;

    await userRepository.update(user, updateData);

    return user;
};

module.exports = {
    updateUserProfile
};