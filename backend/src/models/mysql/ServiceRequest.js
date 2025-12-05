// backend/src/models/mysql/ServiceRequest.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');
const Professional = require('./Professional');

const ServiceRequest = sequelize.define('ServiceRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    professional_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Professional,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    service_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    price_quote: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    }
}, {
    tableName: 'service_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
});

ServiceRequest.belongsTo(User, { as: 'Client', foreignKey: 'client_id' });
ServiceRequest.belongsTo(Professional, { as: 'Professional', foreignKey: 'professional_id' });

Professional.hasMany(ServiceRequest, { foreignKey: 'professional_id' });
User.hasMany(ServiceRequest, { foreignKey: 'client_id' });

module.exports = ServiceRequest;