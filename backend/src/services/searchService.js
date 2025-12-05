// backend/src/services/searchService.js
const professionalRepository = require('../repositories/professionalRepository');
const productRepository = require('../repositories/productRepository');

const searchAll = async (query) => {
    if (!query || query.trim() === '') {
        return { professionals: [], products: [] };
    }
    
    const [professionals, products] = await Promise.all([
        professionalRepository.search(query),
        productRepository.search(query)
    ]);

    return {
        professionals,
        products
    };
};

module.exports = {
    searchAll
};