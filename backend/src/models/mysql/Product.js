// backend/src/models/mysql/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Business = require('./Business');
const Professional = require('./Professional');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seller_type: {
        type: DataTypes.ENUM('business', 'professional', 'user'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    condition: {
        type: DataTypes.ENUM('new', 'used', 'refurbished'),
        defaultValue: 'new'
    },
    category: {
        type: DataTypes.STRING(100)
    },
    status: {
        type: DataTypes.ENUM('active', 'draft', 'out_of_stock'),
        defaultValue: 'active'
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
});

module.exports = Product;