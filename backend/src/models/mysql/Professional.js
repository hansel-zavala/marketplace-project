// backend/src/models/mysql/Professional.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');

const Professional = sequelize.define('Professional', {
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
    identity_number: { 
        type: DataTypes.STRING(20),
        allowNull: true, 
        unique: true     
    },
    identity_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    verification_status: {
        type: DataTypes.ENUM('unverified', 'pending', 'verified', 'rejected'),
        defaultValue: 'unverified'
    },
    business_name: { type: DataTypes.STRING(200) },
    profession: { 
        type: DataTypes.STRING(100),
        allowNull: false 
    },
    experience_years: { type: DataTypes.INTEGER, defaultValue: 0 },
    hourly_rate: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    bio: { type: DataTypes.TEXT },
    service_radius: { type: DataTypes.INTEGER, defaultValue: 10 },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.00 },
    
    verified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    }
}, {
    tableName: 'professionals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
});

User.hasOne(Professional, { foreignKey: 'user_id' });
Professional.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Professional;