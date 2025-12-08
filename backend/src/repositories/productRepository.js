// backend/src/repositories/productRepository.js\
const { Op } = require('sequelize');
const Product = require('../models/mysql/Product');
const ProductImage = require('../models/mysql/ProductImage');

const create = async (productData, imagesData) => {
    const product = await Product.create(productData);

    if (imagesData && imagesData.length > 0) {
        const imagesWithId = imagesData.map(img => ({
            ...img,
            product_id: product.id
        }));
        await ProductImage.bulkCreate(imagesWithId);
    }

    return product;
};

const findById = async (id) => {
    return await Product.findByPk(id, {
        include: [{ model: ProductImage, as: 'images' }]
    });
};

const findBySeller = async (sellerId, sellerType) => {
    return await Product.findAll({
        where: { seller_id: sellerId, seller_type: sellerType },
        include: [{ model: ProductImage, as: 'images' }],
        order: [['created_at', 'DESC']]
    });
};

const deleteById = async (id) => {
    return await Product.destroy({ where: { id } });
};

const update = async (product, data) => {
    return await product.update(data);
};

const addImages = async (imagesData) => {
    return await ProductImage.bulkCreate(imagesData);
};

const search = async (query) => {
    return await Product.findAll({
        where: {
            status: 'active',
            [Op.or]: [
                { title: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } },
                { category: { [Op.like]: `%${query}%` } }
            ]
        },
        include: [{ model: ProductImage, as: 'images' }],
        limit: 20
    });
};

const findAll = async (limit = 20) => {
    return await Product.findAll({
        where: { status: 'active' },
        include: [{ model: ProductImage, as: 'images' }],
        limit: limit,
        order: [['created_at', 'DESC']]
    });
};

module.exports = {
    create,
    findById,
    findBySeller,
    deleteById,
    update,
    addImages,
    search,
    findAll
};