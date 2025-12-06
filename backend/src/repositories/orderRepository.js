// backend/src/repositories/orderRepository.js
const Order = require('../models/mysql/Order');
const OrderItem = require('../models/mysql/OrderItem');
const Product = require('../models/mysql/Product');
const User = require('../models/mysql/User');
const Address = require('../models/mysql/Address');

const create = async (orderData, itemsData, transaction) => {
    const order = await Order.create(orderData, { transaction });

    const itemsWithOrderId = itemsData.map(item => ({
        ...item,
        order_id: order.id
    }));

    await OrderItem.bulkCreate(itemsWithOrderId, { transaction });

    return order;
};

const findByCustomerId = async (customerId) => {
    return await Order.findAll({
        where: { customer_id: customerId },
        include: [
            { 
                model: OrderItem, 
                as: 'Items',
                include: [{ model: Product, as: 'Product' }]
            },
            { model: Address, as: 'ShippingAddress' }
        ],
        order: [['created_at', 'DESC']]
    });
};

const findSalesBySellerId = async (sellerId) => {
    return await OrderItem.findAll({
        where: { seller_id: sellerId },
        include: [
            { 
                model: Order, 
                include: [
                    { model: User, as: 'Customer', attributes: ['first_name', 'last_name', 'email', 'phone'] },
                    { model: Address, as: 'ShippingAddress' }
                ] 
            },
            { model: Product, as: 'Product' }
        ],
        order: [['created_at', 'DESC']]
    });
};

module.exports = { create, findByCustomerId, findSalesBySellerId };