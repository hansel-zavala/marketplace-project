// backend/src/repositories/userRepository.js
const User = require('../models/mysql/User');

const findByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

const findByUuid = async (uuid) => {
    return await User.findOne({ where: { uuid } });
};

const findById = async (id) => {
    return await User.findByPk(id);
};

const create = async (userData) => {
    return await User.create(userData);
};

const update = async (userInstance, updateData) => {
    return await userInstance.update(updateData);
};

module.exports = {
    findByEmail,
    findByUuid,
    findById,
    create,
    update
};