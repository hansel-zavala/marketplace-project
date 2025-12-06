// backend/src/models/mysql/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');
const Address = require('./Address');
const { v4: uuidv4 } = require('uuid');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_number: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        defaultValue: () => `ORD-${Date.now()}`
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('cash_on_delivery', 'card'),
        defaultValue: 'cash_on_delivery'
    },
    shipping_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Address,
            key: 'id'
        }
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Order.belongsTo(User, { as: 'Customer', foreignKey: 'customer_id' });
Order.belongsTo(Address, { as: 'ShippingAddress', foreignKey: 'shipping_address_id' });
User.hasMany(Order, { foreignKey: 'customer_id' });

module.exports = Order;