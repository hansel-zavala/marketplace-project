// backend/src/models/mysql/Business.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');

const Business = sequelize.define('Business', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    business_name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    tax_id: { // RTN o RUC
        type: DataTypes.STRING(50),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT
    },
    logo: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    cover_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    website: {
        type: DataTypes.STRING(255)
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    address: {
        type: DataTypes.STRING(255)
    },
    business_hours: {
        type: DataTypes.JSON, 
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    verification_status: {
        type: DataTypes.ENUM('unverified', 'pending', 'verified', 'rejected'),
        defaultValue: 'unverified'
    }
}, {
    tableName: 'businesses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
});

User.hasOne(Business, { foreignKey: 'user_id' });
Business.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Business;