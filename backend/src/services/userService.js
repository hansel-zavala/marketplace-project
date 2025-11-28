// backend/src/services/userService.js
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

const updateUserProfile = async (uuid, data) => {
    const user = await userRepository.findByUuid(uuid);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const updateData = {};
    if (data.first_name) updateData.first_name = data.first_name;
    if (data.last_name) updateData.last_name = data.last_name;
    if (data.phone) updateData.phone = data.phone;
    if (data.email) updateData.email = data.email;
    
    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password_hash = await bcrypt.hash(data.password, salt);
    }

    await userRepository.update(user, updateData);

    return user;
};

const updateUserAvatar = async (uuid, filePath) => {
    const user = await userRepository.findByUuid(uuid);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    await userRepository.update(user, { profile_image: filePath });
    return user;
};

module.exports = {
    updateUserProfile,
    updateUserAvatar
};