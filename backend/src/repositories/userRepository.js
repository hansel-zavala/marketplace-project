// src/repositories/userRepository.js
const User = require('../models/mysql/User');

const findByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

const create = async (userData) => {
    return await User.create(userData);
};

const findById = async (id) => {
    return await User.findByPk(id);
};

module.exports = {
    findByEmail,
    create,
    findById
};