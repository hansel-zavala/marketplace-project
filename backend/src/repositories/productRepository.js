// backend/src/repositories/productRepository.js
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

module.exports = {
    create,
    findById,
    findBySeller,
    deleteById,
    update,
    addImages
};