const professionalRepository = require('../repositories/professionalRepository');
const userRepository = require('../repositories/userRepository');

const upsertProfile = async (userUuid, data) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    let professional = await professionalRepository.findByUserId(user.id);

    if (professional) {
        return await professionalRepository.update(professional, data);
    } else {
        if (user.user_type === 'customer') {
            await userRepository.update(user, { user_type: 'professional' });
        }
        return await professionalRepository.create({ ...data, user_id: user.id });
    }
};

const submitVerification = async (userUuid, identityNumber, identityImagePath) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    const professional = await professionalRepository.findByUserId(user.id);
    if (!professional) throw new Error('Debes crear tu perfil profesional antes de verificarte');

    return await professionalRepository.update(professional, {
        identity_number: identityNumber,
        identity_image: identityImagePath,
        verification_status: 'pending'
    });
};

const getProfile = async (userUuid) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');
    return await professionalRepository.findByUserId(user.id);
};

module.exports = { upsertProfile, getProfile, submitVerification };