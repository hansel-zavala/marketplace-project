// backend/src/repositories/businessRepository.js
const Business = require('../models/mysql/Business');
const OrderItem = require('../models/mysql/OrderItem');
const { Op } = require('sequelize');

const create = async (data) => {
    return await Business.create(data);
};

const findByUserId = async (userId) => {
    return await Business.findOne({ where: { user_id: userId } });
};

const findById = async (id) => {
    return await Business.findByPk(id);
};

const update = async (business, data) => {
    return await business.update(data);
};

const findAll = async () => {
    return await Business.findAll({
        order: [['created_at', 'DESC']]
    });
};

const countSoldItems = async (businessId) => {
    const business = await Business.findByPk(businessId);
    if (!business) return 0;
    
    return await OrderItem.sum('quantity', {
        where: { seller_id: business.user_id }
    }) || 0;
};

const search = async (query) => {
    return await Business.findAll({
        where: {
            [Op.or]: [
                { business_name: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } }
            ]
        },
        limit: 10
    });
};

module.exports = {
    create,
    findByUserId,
    findById,
    update,
    findAll,
    countSoldItems,
    search
};