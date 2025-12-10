// backend/src/controllers/orderController.js
const orderService = require('../services/orderService');
const notificationController = require('./notificationController');
const productRepository = require('../repositories/productRepository');
const businessRepository = require('../repositories/businessRepository');
const professionalRepository = require('../repositories/professionalRepository');

const createOrder = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const order = await orderService.createOrder(userUuid, req.body);
        
        const notifySellers = async () => {
            try {
                const sellerMap = {};
                
                for (const item of req.body.items) {
                    const product = await productRepository.findById(item.product_id);
                    if (product) {
                        if (!sellerMap[product.seller_id]) {
                            sellerMap[product.seller_id] = { total: 0, items: 0 };
                        }
                        sellerMap[product.seller_id].total += parseFloat(product.price) * item.quantity;
                        sellerMap[product.seller_id].items += item.quantity;
                    }
                }

                for (const sellerId of Object.keys(sellerMap)) {
                    let userId = null;
                    
                    const business = await businessRepository.findById(sellerId);
                    if (business) {
                        userId = business.user_id;
                    } else {
                        const professional = await professionalRepository.findById(sellerId);
                        if (professional) {
                            userId = professional.user_id;
                        }
                    }

                    if (userId) {
                        await notificationController.createNotification(
                            userId,
                            'new_order',
                            '¡Nueva Venta!',
                            `Has recibido un pedido de ${req.user.first_name} por L. ${sellerMap[sellerId].total.toFixed(2)} (${sellerMap[sellerId].items} items).`,
                            { link: '/user/sales' }
                        );
                    }
                }
            } catch (err) {
                console.error('Error notificado vendedores:', err);
            }
        };

        notifySellers();

        res.status(201).json({ 
            message: '¡Pedido realizado con éxito!', 
            order 
        });
    } catch (error) {
        console.error(error);
        const status = error.message.includes('Stock') || error.message.includes('Dirección') ? 400 : 500;
        res.status(status).json({ message: error.message || 'Error al procesar el pedido' });
    }
};

const getOrders = async (req, res) => {
    try {
        const { type } = req.query;
        const userUuid = req.user.uuid;

        let orders;
        if (type === 'seller') {
            orders = await orderService.getSellerOrders(userUuid);
        } else {
            orders = await orderService.getCustomerOrders(userUuid);
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
};

module.exports = { createOrder, getOrders };