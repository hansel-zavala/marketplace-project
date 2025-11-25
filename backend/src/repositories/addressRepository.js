// backend/src/repositories/addressRepository.js
const Address = require('../models/mysql/Address');

const create = async (addressData) => {
    return await Address.create(addressData);
};

const findAllByUserId = async (userId) => {
    return await Address.findAll({ 
        where: { user_id: userId },
        order: [['is_default', 'DESC'], ['created_at', 'DESC']]
    });
};

const countByUserId = async (userId) => {
    return await Address.count({ where: { user_id: userId } });
};

const resetDefaults = async (userId) => {
    return await Address.update(
        { is_default: false }, 
        { where: { user_id: userId } }
    );
};

const findByIdAndUserId = async (id, userId) => {
    return await Address.findOne({ where: { id, user_id: userId } });
};

const deleteById = async (id) => {
    return await Address.destroy({ where: { id } });
};

module.exports = {
    create,
    findAllByUserId,
    countByUserId,
    resetDefaults,
    findByIdAndUserId,
    deleteById
};