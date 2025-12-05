// backend/src/repositories/serviceRequestRepository.js
const ServiceRequest = require('../models/mysql/ServiceRequest');
const User = require('../models/mysql/User');
const Professional = require('../models/mysql/Professional');

const create = async (data) => {
    return await ServiceRequest.create(data);
};

const findById = async (id) => {
    return await ServiceRequest.findByPk(id, {
        include: [
            { model: User, as: 'Client', attributes: ['first_name', 'last_name', 'email', 'phone'] },
            { model: Professional, as: 'Professional' }
        ]
    });
};

const findByClientId = async (clientId) => {
    return await ServiceRequest.findAll({
        where: { client_id: clientId },
        include: [{ 
            model: Professional, 
            as: 'Professional',
            include: [{ 
                model: User, 
                attributes: ['first_name', 'last_name', 'profile_image'] 
            }] 
        }],
        order: [['created_at', 'DESC']]
    });
};

const findByProfessionalId = async (professionalId) => {
    return await ServiceRequest.findAll({
        where: { professional_id: professionalId },
        include: [{ model: User, as: 'Client', attributes: ['first_name', 'last_name', 'profile_image'] }],
        order: [['created_at', 'DESC']]
    });
};

const updateStatus = async (request, status) => {
    return await request.update({ status });
};

module.exports = {
    create,
    findById,
    findByClientId,
    findByProfessionalId,
    updateStatus
};