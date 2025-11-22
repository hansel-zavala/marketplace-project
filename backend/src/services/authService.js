// src/services/authService.js
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (data) => {
    const { first_name, last_name, email, password, user_type, phone } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('El correo ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await userRepository.create({
        first_name,
        last_name,
        email,
        password_hash,
        user_type,
        phone
    });

    return newUser;
};

const loginUser = async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
        { id: user.id, uuid: user.uuid, role: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    return { user, token };
};

module.exports = {
    registerUser,
    loginUser
};