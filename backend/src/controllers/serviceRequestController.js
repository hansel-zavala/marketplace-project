// backend/src/controllers/serviceRequestController.js
const serviceRequestService = require('../services/serviceRequestService');

const create = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const request = await serviceRequestService.createRequest(userUuid, req.body);
        res.status(201).json({ message: 'Solicitud enviada', request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear solicitud' });
    }
};

const getMyRequestsAsClient = async (req, res) => {
    try {
        const requests = await serviceRequestService.getClientRequests(req.user.uuid);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyRequestsAsProfessional = async (req, res) => {
    try {
        const requests = await serviceRequestService.getProfessionalRequests(req.user.uuid);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await serviceRequestService.updateRequestStatus(req.user.uuid, id, status);
        res.json({ message: `Solicitud marcada como ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { create, getMyRequestsAsClient, getMyRequestsAsProfessional, updateStatus };