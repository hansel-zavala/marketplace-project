// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth } = require('../middleware/authMiddleware');
const { validateProduct } = require('../validators/productValidator');
const createUploader = require('../middleware/uploadMiddleware');

const uploadProduct = createUploader('products');

router.get('/business/:businessId', productController.getProductsByBusiness);
router.get('/:id', productController.getOneProduct);

router.use(auth);

router.get('/me', productController.getMyProducts);

router.post(
    '/',
    uploadProduct.array('images', 5),
    validateProduct,
    productController.createProduct
);



router.put(
    '/:id',
    uploadProduct.array('images', 5),
    validateProduct,
    productController.updateProduct
);

router.delete('/:id', productController.deleteProduct);

module.exports = router;