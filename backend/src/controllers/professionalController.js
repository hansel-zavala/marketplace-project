const professionalService = require('../services/professionalService');

const updateProfile = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const profile = await professionalService.upsertProfile(userUuid, req.body);
        
        res.json({
            message: 'Perfil profesional guardado correctamente',
            profile
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const profile = await professionalService.getProfile(userUuid);
        
        if (!profile) {
            return res.status(404).json({ message: 'No tienes perfil profesional' });
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const requestVerification = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Debes subir una foto de tu documento de identidad' });
        }

        const { identity_number } = req.body;
        if (!identity_number) {
            return res.status(400).json({ message: 'El número de identidad es obligatorio' });
        }

        const userUuid = req.user.uuid;
        const filePath = `uploads/documents/${req.file.filename}`;

        await professionalService.submitVerification(userUuid, identity_number, filePath);

        res.json({
            message: 'Solicitud enviada exitosamente. Tu perfil está en revisión.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error al procesar la verificación' });
    }
};

const getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await professionalService.getPublicProfileById(id);
        
        if (!profile) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener perfil público' });
    }
};

module.exports = { updateProfile, getMyProfile, requestVerification, getPublicProfile };