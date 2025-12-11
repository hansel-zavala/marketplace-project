// backend/src/services/searchService.js
const professionalRepository = require('../repositories/professionalRepository');
const productRepository = require('../repositories/productRepository');
const businessRepository = require('../repositories/businessRepository');

const searchAll = async (query) => {
    if (!query || query.trim() === '') {
        return { professionals: [], products: [], businesses: [] };
    }
    
    const [professionals, products, businesses] = await Promise.all([
        professionalRepository.search(query),
        productRepository.search(query),
        businessRepository.search(query)
    ]);

    return {
        professionals,
        products,
        businesses
    };
};

module.exports = {
    searchAll
};