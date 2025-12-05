// backend/src/services/serviceRequestService.js
const serviceRequestRepository = require('../repositories/serviceRequestRepository');
const userRepository = require('../repositories/userRepository');
const professionalRepository = require('../repositories/professionalRepository');

const createRequest = async (clientUuid, data) => {
    const client = await userRepository.findByUuid(clientUuid);
    
    const professional = await professionalRepository.findByIdWithUser(data.professional_id);
    if (!professional) throw new Error('Profesional no encontrado');
    
    return await serviceRequestRepository.create({
        client_id: client.id,
        professional_id: data.professional_id,
        title: data.title,
        description: data.description,
        service_date: data.service_date,
        location: data.location
    });
};

const getClientRequests = async (clientUuid) => {
    const client = await userRepository.findByUuid(clientUuid);
    return await serviceRequestRepository.findByClientId(client.id);
};

const getProfessionalRequests = async (proUuid) => {
    const user = await userRepository.findByUuid(proUuid);
    const professional = await professionalRepository.findByUserId(user.id);
    
    if (!professional) throw new Error('No eres profesional');
    
    return await serviceRequestRepository.findByProfessionalId(professional.id);
};

const updateRequestStatus = async (userUuid, requestId, newStatus) => {
    const user = await userRepository.findByUuid(userUuid);
    const request = await serviceRequestRepository.findById(requestId);
    
    if (!request) throw new Error('Solicitud no encontrada');

    const professional = await professionalRepository.findByUserId(user.id);
    
    if (!professional || request.professional_id !== professional.id) {
        throw new Error('No tienes permiso para modificar esta solicitud');
    }

    return await serviceRequestRepository.updateStatus(request, newStatus);
};

module.exports = {
    createRequest,
    getClientRequests,
    getProfessionalRequests,
    updateRequestStatus
};