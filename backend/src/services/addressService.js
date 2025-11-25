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

const updateAddress = async (userUuid, addressId, updateData) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    const address = await addressRepository.findByIdAndUserId(addressId, user.id);

    if (!address) throw new Error('Dirección no encontrada');

    if (updateData.is_default) {
        await addressRepository.resetDefaults(user.id);
    }

    return await address.update(updateData);
};

const deleteAddress = async (userUuid, addressId) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    const address = await addressRepository.findByIdAndUserId(addressId, user.id);
    if (!address) throw new Error('Dirección no encontrada o no autorizada');

    return await addressRepository.deleteById(addressId);
};

module.exports = {
    addAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress
};