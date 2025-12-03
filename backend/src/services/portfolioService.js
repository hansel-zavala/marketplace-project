// backend/src/services/portfolioService.js
const portfolioRepository = require('../repositories/portfolioRepository');
const userRepository = require('../repositories/userRepository');
const professionalRepository = require('../repositories/professionalRepository');

const addProject = async (userUuid, projectData, imageFiles) => {
    const user = await userRepository.findByUuid(userUuid);
    const professional = await professionalRepository.findByUserId(user.id);

    if (!professional) {
        throw new Error('No tienes un perfil profesional activo');
    }

    if (!imageFiles || imageFiles.length === 0) {
        throw new Error('Debes subir al menos una foto');
    }
    const imagePaths = imageFiles.map(file => `uploads/portfolio/${file.filename}`);

    return await portfolioRepository.create({
        professionalId: professional.id,
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        images: imagePaths,
        completedAt: projectData.completedAt || new Date()
    });
};

const getProfessionalPortfolio = async (professionalId) => {
    return await portfolioRepository.findByProfessionalId(professionalId);
};

const removeProject = async (userUuid, projectId) => {
    const user = await userRepository.findByUuid(userUuid);
    const professional = await professionalRepository.findByUserId(user.id);
    
    const project = await portfolioRepository.findById(projectId);
    if (!project) throw new Error('Proyecto no encontrado');

    if (project.professionalId !== professional.id) {
        throw new Error('No tienes permiso para eliminar este proyecto');
    }

    return await portfolioRepository.deleteById(projectId);
};

module.exports = {
    addProject,
    getProfessionalPortfolio,
    removeProject
};