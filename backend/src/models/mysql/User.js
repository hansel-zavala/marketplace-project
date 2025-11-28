// src/models/mysql/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.STRING(36),
        defaultValue: () => uuidv4(),
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_type: {
        type: DataTypes.ENUM('customer', 'professional', 'business'),
        allowNull: false,
        defaultValue: 'customer'
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    profile_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'suspended', 'deleted'),
        defaultValue: 'active'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;