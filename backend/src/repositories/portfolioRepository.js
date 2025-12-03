// backend/src/repositories/portfolioRepository.js
const Portfolio = require('../models/mongodb/Portfolio');

const create = async (projectData) => {
    const project = new Portfolio(projectData);
    return await project.save();
};

const findByProfessionalId = async (professionalId) => {
    return await Portfolio.find({ professionalId }).sort({ createdAt: -1 });
};

const findById = async (id) => {
    return await Portfolio.findById(id);
};

const deleteById = async (id) => {
    return await Portfolio.findByIdAndDelete(id);
};

module.exports = {
    create,
    findByProfessionalId,
    findById,
    deleteById
};