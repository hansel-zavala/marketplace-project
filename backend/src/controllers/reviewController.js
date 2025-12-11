// backend/src/controllers/reviewController.js
const Review = require('../models/mysql/Review');
const Order = require('../models/mysql/Order');
const OrderItem = require('../models/mysql/OrderItem');
const ServiceRequest = require('../models/mysql/ServiceRequest');
const Product = require('../models/mysql/Product');
const Professional = require('../models/mysql/Professional');

const createReview = async (req, res) => {
    try {
        const authorId = req.user.id;
        const { entity_id, entity_type, rating, comment, order_id } = req.body;

        let isVerified = false;

        if (entity_type === 'product') {
            const purchase = await OrderItem.findOne({
                where: { product_id: entity_id },
                include: [{
                    model: Order,
                    where: { customer_id: authorId }
                }]
            });
            if (purchase) isVerified = true;

        } else if (entity_type === 'professional') {
            const service = await ServiceRequest.findOne({
                where: {
                    client_id: authorId,
                    professional_id: entity_id,
                    status: 'completed'
                }
            });
            if (service) isVerified = true;
        }

        if (!isVerified) {
            return res.status(403).json({ message: 'No puedes reseñar algo que no has comprado o completado.' });
        }

        const existingReview = await Review.findOne({
            where: { author_id: authorId, entity_id, entity_type }
        });
        
        if (existingReview) {
            return res.status(400).json({ message: 'Ya has calificado esto anteriormente.' });
        }

        const review = await Review.create({
            author_id: authorId,
            entity_id,
            entity_type,
            rating,
            comment,
            order_id 
        });

        const stats = await Review.findAll({
            where: { entity_id, entity_type },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'countReviews']
            ],
            raw: true
        });

        const newAverage = parseFloat(stats[0].avgRating).toFixed(1);
        
        if (entity_type === 'product') {
            await Product.update(
                { rating: newAverage }, 
                { where: { id: entity_id } }
            );
        } else if (entity_type === 'professional') {
            await Professional.update(
                { rating: newAverage }, 
                { where: { id: entity_id } }
            );
        } else if (entity_type === 'business') {
             await Business.update(
                { rating: newAverage }, 
                { where: { id: entity_id } }
            );
        }

        res.status(201).json({ message: '¡Gracias por tu opinión!', review });

    } catch (error) {
        console.error('Error creating review:', error); // Improved logging
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Error al guardar reseña' });
    }
};

const getReviews = async (req, res) => {
    try {
        const { entityId, entityType } = req.params;
        const reviews = await Review.findAll({
            where: { entity_id: entityId, entity_type: entityType },
            include: ['Author'],
            order: [['created_at', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo reseñas' });
    }
};

module.exports = { createReview, getReviews };