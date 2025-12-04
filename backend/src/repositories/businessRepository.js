// backend/src/repositories/businessRepository.js
const Business = require('../models/mysql/Business');

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

module.exports = {
    create,
    findByUserId,
    findById,
    update
};