// src/config/database.js
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

const connectMongo = async () => {
    if (!process.env.MONGO_URI) return;

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB Conectado');
    } catch (error) {
        console.warn('MongoDB no disponible.');
    }
};

module.exports = { sequelize, connectMongo };