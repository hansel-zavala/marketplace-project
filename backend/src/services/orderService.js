// backend/src/services/orderService.js
const { sequelize } = require('../config/database');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const userRepository = require('../repositories/userRepository');
const addressRepository = require('../repositories/addressRepository');
const businessRepository = require('../repositories/businessRepository');
const professionalRepository = require('../repositories/professionalRepository');

const createOrder = async (userUuid, orderData) => {
    const transaction = await sequelize.transaction();
    
    try {
        const user = await userRepository.findByUuid(userUuid);
        
        const address = await addressRepository.findByIdAndUserId(orderData.shipping_address_id, user.id);
        if (!address) throw new Error('Dirección de envío no válida');

        let total = 0;
        const finalItems = [];

        for (const item of orderData.items) {
            const product = await productRepository.findById(item.product_id);
            
            if (!product) throw new Error(`Producto ID ${item.product_id} no encontrado`);
            
            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para: ${product.title}. Solo quedan ${product.stock}.`);
            }

            await product.update({ stock: product.stock - item.quantity }, { transaction });

            const subtotal = parseFloat(product.price) * item.quantity;
            total += subtotal;

            finalItems.push({
                product_id: product.id,
                seller_id: product.seller_id,
                quantity: item.quantity,
                price: product.price,
                subtotal: subtotal
            });
        }

        const newOrder = await orderRepository.create({
            customer_id: user.id,
            shipping_address_id: address.id,
            total: total,
            status: 'confirmed',
            payment_method: 'cash_on_delivery'
        }, finalItems, transaction);

        await transaction.commit();
        return newOrder;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getCustomerOrders = async (userUuid) => {
    const user = await userRepository.findByUuid(userUuid);
    return await orderRepository.findByCustomerId(user.id);
};

const getSellerOrders = async (userUuid) => {
    const user = await userRepository.findByUuid(userUuid);
    
    let sellerId = null;

    if (user.user_type === 'business') {
        const business = await businessRepository.findByUserId(user.id);
        if (business) sellerId = business.id;
    } else if (user.user_type === 'professional') {
        const professional = await professionalRepository.findByUserId(user.id);
        if (professional) sellerId = professional.id;
    }

    if (!sellerId) {
        return [];
    }

    const salesItems = await orderRepository.findSalesBySellerId(sellerId);
    return salesItems;
};

module.exports = { createOrder, getCustomerOrders, getSellerOrders };