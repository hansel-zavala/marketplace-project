// src/services/authService.js
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService');

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

    const token = jwt.sign(
        { id: newUser.id, uuid: newUser.uuid, role: newUser.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    return { user: newUser, token };
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

const requestPasswordReset = async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado'); 
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    
    await userRepository.update(user, {
        reset_code: code,
        reset_code_expires: expires
    });

    await emailService.sendResetCode(email, code);
    
    return true;
};

const resetPassword = async (email, code, newPassword) => {
    const user = await userRepository.findByEmail(email);
    
    if (!user || user.reset_code !== code) {
        throw new Error('Código inválido');
    }

    if (new Date() > user.reset_code_expires) {
        throw new Error('El código ha expirado');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await userRepository.update(user, {
        password_hash: password_hash,
        reset_code: null,
        reset_code_expires: null
    });

    return true;
};

module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword
};