// backend/src/controllers/serviceRequestController.js
const serviceRequestService = require('../services/serviceRequestService');
const notificationController = require('./notificationController');
const professionalRepository = require('../repositories/professionalRepository');
const serviceRequestRepository = require('../repositories/serviceRequestRepository');

const create = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const request = await serviceRequestService.createRequest(userUuid, req.body);

        const professional = await professionalRepository.findByIdWithUser(req.body.professional_id);
        
        if (professional && professional.User) {
             await notificationController.createNotification(
                professional.User.id,
                'job_request',
                'Nueva Solicitud de Trabajo',
                `Un cliente ha solicitado tus servicios: "${req.body.title}".`,
                { link: '/professional/requests' }
            );
        }

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

        const request = await serviceRequestRepository.findById(id);
        
        if (request) {
            let message = '';
            let type = 'order_status';
            if (status === 'accepted') message = '¡Tu solicitud ha sido aceptada! El profesional se pondrá en contacto.';
            else if (status === 'rejected') message = 'Tu solicitud ha sido rechazada por el profesional.';
            else if (status === 'completed') message = 'El profesional ha marcado el trabajo como completado.';

            if (message) {
                 await notificationController.createNotification(
                    request.client_id,
                    type,
                    `Solicitud ${status === 'accepted' ? 'Aceptada' : status === 'rejected' ? 'Rechazada' : 'Completada'}`,
                    message,
                    { link: '/service-requests' } 
                );
            }
        }

        res.json({ message: `Solicitud marcada como ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { create, getMyRequestsAsClient, getMyRequestsAsProfessional, updateStatus };