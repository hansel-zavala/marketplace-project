// backend/src/services/searchService.js
const professionalRepository = require('../repositories/professionalRepository');

const searchProfessionals = async (query) => {
    if (!query || query.trim() === '') {
        return await professionalRepository.findAll();
    }
    
    return await professionalRepository.search(query);
};

module.exports = {
    searchProfessionals
};