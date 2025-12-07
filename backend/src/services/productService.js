// backend/src/services/productService.js
const productRepository = require('../repositories/productRepository');
const userRepository = require('../repositories/userRepository');
const professionalRepository = require('../repositories/professionalRepository');
const businessRepository = require('../repositories/businessRepository');

const createProduct = async (userUuid, data, files) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    let sellerId = null;
    let sellerType = null;
    
    const business = await businessRepository.findByUserId(user.id);
    if (business) {
        sellerId = business.id;
        sellerType = 'business';
    } else {
        const professional = await professionalRepository.findByUserId(user.id);
        if (professional) {
            sellerId = professional.id;
            sellerType = 'professional';
        } else {
            sellerId = user.id;
            sellerType = 'user';
        }
    }

    const imagesData = [];
    if (files && files.length > 0) {
        files.forEach((file, index) => {
            imagesData.push({
                image_url: `uploads/products/${file.filename}`,
                is_primary: index === 0
            });
        });
    }

    return await productRepository.create({
        ...data,
        seller_id: sellerId,
        seller_type: sellerType,
        status: 'active'
    }, imagesData);
};

const getMyProducts = async (userUuid) => {
    const user = await userRepository.findByUuid(userUuid);
    
    const business = await businessRepository.findByUserId(user.id);
    if (business) {
        return await productRepository.findBySeller(business.id, 'business');
    }

    const professional = await professionalRepository.findByUserId(user.id);
    if (professional) {
        return await productRepository.findBySeller(professional.id, 'professional');
    }

    return await productRepository.findBySeller(user.id, 'user');
};

const getProductById = async (id) => {
    return await productRepository.findById(id);
};

const updateProduct = async (userUuid, productId, data, files) => {
    const product = await productRepository.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    let isOwner = false;
    if (product.seller_type === 'business') {
        const business = await businessRepository.findByUserId(user.id);
        if (business && business.id === product.seller_id) isOwner = true;
    } else if (product.seller_type === 'professional') {
        const professional = await professionalRepository.findByUserId(user.id);
        if (professional && professional.id === product.seller_id) isOwner = true;
    }

    if (!isOwner) throw new Error('No tienes permiso para editar este producto');

    await productRepository.update(product, data);

    if (files && files.length > 0) {
        const imagesData = files.map((file) => ({
            product_id: product.id,
            image_url: `uploads/products/${file.filename}`,
            is_primary: false
        }));
        await productRepository.addImages(imagesData);
    }

    return await productRepository.findById(productId);
};

const deleteProduct = async (userUuid, productId) => {
    const product = await productRepository.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    let isOwner = false;
    if (product.seller_type === 'business') {
        const business = await businessRepository.findByUserId(user.id);
        if (business && business.id === product.seller_id) isOwner = true;
    } else if (product.seller_type === 'professional') {
        const professional = await professionalRepository.findByUserId(user.id);
        if (professional && professional.id === product.seller_id) isOwner = true;
    }

    if (!isOwner) throw new Error('No tienes permiso para eliminar este producto');

    return await productRepository.deleteById(productId);
};

const getProductsByBusiness = async (businessId) => {
    const business = await businessRepository.findById(businessId);
    if (!business) throw new Error('Negocio no encontrado');
    
    return await productRepository.findBySeller(businessId, 'business');
};

const getProductDetail = async (productId) => {
    const product = await productRepository.findById(productId);
    if (!product) return null;

    let seller = null;
    if (product.seller_type === 'business') {
        seller = await businessRepository.findById(product.seller_id);
    } else {
        seller = await professionalRepository.findByIdWithUser(product.seller_id);
    }

    return {
        ...product.toJSON(),
        seller
    };
};

module.exports = {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByBusiness,
    getProductDetail
};