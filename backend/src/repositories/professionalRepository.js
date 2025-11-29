const Professional = require('../models/mysql/Professional');

const create = async (data) => {
    return await Professional.create(data);
};

const findByUserId = async (userId) => {
    return await Professional.findOne({ where: { user_id: userId } });
};

const update = async (professional, data) => {
    return await professional.update(data);
};

module.exports = { create, findByUserId, update };