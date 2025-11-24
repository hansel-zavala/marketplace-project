// backend/src/controllers/addressController.js
const addressService = require('../services/addressService');

const createAddress = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const newAddress = await addressService.addAddress(userUuid, req.body);

        res.status(201).json({
            message: 'Dirección agregada exitosamente',
            address: newAddress
        });

    } catch (error) {
        console.error(error);
        const status = error.message === 'Usuario no encontrado' ? 404 : 500;
        res.status(status).json({ message: error.message || 'Error al guardar dirección' });
    }
};

const getMyAddresses = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const addresses = await addressService.getUserAddresses(userUuid);
        res.json(addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener direcciones' });
    }
};

module.exports = {
    createAddress,
    getMyAddresses
};