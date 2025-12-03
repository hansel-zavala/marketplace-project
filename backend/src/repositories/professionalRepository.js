const Professional = require('../models/mysql/Professional');
const User = require('../models/mysql/User');

const create = async (data) => {
    return await Professional.create(data);
};

const findByUserId = async (userId) => {
    return await Professional.findOne({ where: { user_id: userId } });
};

const update = async (professional, data) => {
    return await professional.update(data);
};

const findByIdWithUser = async (id) => {
    return await Professional.findByPk(id, {
        include: [{
            model: User,
            attributes: ['first_name', 'last_name', 'profile_image', 'email', 'phone', 'created_at']
        }]
    });
};

module.exports = { create, findByUserId, update, findByIdWithUser };