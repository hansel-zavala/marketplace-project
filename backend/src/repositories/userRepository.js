// src/repositories/userRepository.js
const User = require('../models/mysql/User');

const findByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

const create = async (userData) => {
    return await User.create(userData);
};

module.exports = {
    findByEmail,
    create
};