// backend/src/controllers/productController.js
const productService = require('../services/productService');
const productRepository = require('../repositories/productRepository');

const createProduct = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const product = await productService.createProduct(userUuid, req.body, req.files);

        res.status(201).json({
            message: 'Producto creado exitosamente',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error al crear producto' });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const products = await productService.getMyProducts(userUuid);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userUuid = req.user.uuid;
        const product = await productService.updateProduct(userUuid, id, req.body, req.files);
        res.json({
            message: 'Producto actualizado exitosamente',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error al actualizar producto' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userUuid = req.user.uuid;
        await productService.deleteProduct(userUuid, id);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error al eliminar producto' });
    }
};

const getProductsByBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const products = await productService.getProductsByBusiness(businessId);
        res.json(products);
    } catch (error) {
        console.error(error);
        if (error.message === 'Negocio no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

const getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductDetail(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const products = await productService.getAllProducts(limit);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

const getRecent = async (req, res) => {
    try {
        const products = await productRepository.findAllRecent();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

module.exports = {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByBusiness,
    getOneProduct,
    getAllProducts,
    getRecent
};