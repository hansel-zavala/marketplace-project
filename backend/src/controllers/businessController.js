// backend/src/controllers/businessController.js
const businessService = require('../services/businessService');

const updateBusiness = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const business = await businessService.upsertBusiness(userUuid, req.body, req.files);
        
        res.json({
            message: 'Negocio guardado correctamente',
            business
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getMyBusiness = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const business = await businessService.getMyBusiness(userUuid);
        
        if (!business) {
            return res.status(404).json({ message: 'No has registrado un negocio aún' });
        }

        res.json(business);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getPublicBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await businessService.getBusinessById(id);
        
        if (!business) {
            return res.status(404).json({ message: 'Negocio no encontrado' });
        }

        res.json(business);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener negocio' });
    }
};

const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await businessService.getAllBusinesses();
        res.json(businesses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener negocios' });
    }
};

module.exports = {
    updateBusiness,
    getMyBusiness,
    getPublicBusiness,
    getAllBusinesses
};