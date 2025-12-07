// backend/src/models/mysql/Review.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');
const Product = require('./Product');
const Professional = require('./Professional');
const Business = require('./Business');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    entity_id: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    entity_type: {
        type: DataTypes.ENUM('product', 'professional', 'business', 'user'),
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Review.belongsTo(User, { as: 'Author', foreignKey: 'author_id' });

module.exports = Review;