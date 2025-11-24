// backend/src/services/addressService.js
const addressRepository = require('../repositories/addressRepository');
const userRepository = require('../repositories/userRepository');

const addAddress = async (userUuid, addressData) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    const count = await addressRepository.countByUserId(user.id);
    
    const shouldBeDefault = count === 0 ? true : (addressData.is_default || false);

    if (shouldBeDefault && count > 0) {
        await addressRepository.resetDefaults(user.id);
    }

    return await addressRepository.create({
        ...addressData,
        user_id: user.id,
        address_type: addressData.address_type || 'shipping',
        is_default: shouldBeDefault
    });
};

const getUserAddresses = async (userUuid) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    return await addressRepository.findAllByUserId(user.id);
};

module.exports = {
    addAddress,
    getUserAddresses
};