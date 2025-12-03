// backend/src/models/mongodb/Portfolio.js
const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    professionalId: {
        type: Number,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    images: [{
        type: String, 
        required: true
    }],
    category: {
        type: String
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);