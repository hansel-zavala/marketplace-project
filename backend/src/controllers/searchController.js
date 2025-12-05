// backend/src/controllers/searchController.js
const searchService = require('../services/searchService');

const search = async (req, res) => {
    try {
        const { q } = req.query; 
        
        const results = await searchService.searchAll(q);
        
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al realizar la búsqueda' });
    }
};

module.exports = {
    search
};