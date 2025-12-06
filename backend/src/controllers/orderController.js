// backend/src/controllers/orderController.js
const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const order = await orderService.createOrder(userUuid, req.body);
        
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