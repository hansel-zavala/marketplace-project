const Professional = require('../models/mysql/Professional');
const User = require('../models/mysql/User');
const { Op } = require('sequelize');

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
            attributes: ['id', 'first_name', 'last_name', 'profile_image', 'email', 'phone', 'created_at']
        }]
    });
};

const search = async (query) => {
    return await Professional.findAll({
        where: {
            [Op.or]: [
                { profession: { [Op.like]: `%${query}%` } },
                { bio: { [Op.like]: `%${query}%` } }
            ],
        },
        include: [{
            model: User,
            attributes: ['first_name', 'last_name', 'profile_image', 'email']
        }]
    });
};

const findAll = async () => {
    return await Professional.findAll({
        include: [{
            model: User,
            attributes: ['first_name', 'last_name', 'profile_image', 'email']
        }],
        order: [['created_at', 'DESC']]
    });
};

module.exports = { 
    create, 
    findByUserId, 
    update, 
    findByIdWithUser,
    search,
    findAll
};