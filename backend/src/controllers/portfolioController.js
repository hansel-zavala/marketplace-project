// backend/src/controllers/portfolioController.js
const portfolioService = require('../services/portfolioService');

const createProject = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const newProject = await portfolioService.addProject(userUuid, req.body, req.files);

        res.status(201).json({
            message: 'Proyecto agregado al portafolio',
            project: newProject
        });
    } catch (error) {
        console.error(error);
        const status = error.message.includes('No tienes') ? 403 : 400;
        res.status(status).json({ message: error.message || 'Error al guardar proyecto' });
    }
};

const getPortfolio = async (req, res) => {
    try {
        const { professionalId } = req.params;
        const projects = await portfolioService.getProfessionalPortfolio(professionalId);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el portafolio' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const { id } = req.params;

        await portfolioService.removeProject(userUuid, id);

        res.json({ message: 'Proyecto eliminado' });
    } catch (error) {
        console.error(error);
        const status = error.message === 'Proyecto no encontrado' ? 404 : 403;
        res.status(status).json({ message: error.message });
    }
};

module.exports = {
    createProject,
    getPortfolio,
    deleteProject
};