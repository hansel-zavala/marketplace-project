// backend/src/services/businessService.js
const businessRepository = require('../repositories/businessRepository');
const userRepository = require('../repositories/userRepository');

const upsertBusiness = async (userUuid, data, files) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');

    let business = await businessRepository.findByUserId(user.id);

    const businessData = { ...data };
    
    if (files?.logo?.[0]) {
        businessData.logo = `uploads/businesses/${files.logo[0].filename}`;
    }
    
    if (files?.cover?.[0]) {
        businessData.cover_image = `uploads/businesses/${files.cover[0].filename}`;
    }

    if (typeof businessData.business_hours === 'string') {
        try {
            businessData.business_hours = JSON.parse(businessData.business_hours);
        } catch (e) {
            delete businessData.business_hours;
        }
    }

    if (business) {
        return await businessRepository.update(business, businessData);
    } else {
        if (user.user_type !== 'business') {
            await userRepository.update(user, { user_type: 'business' });
        }

        return await businessRepository.create({
            ...businessData,
            user_id: user.id
        });
    }
};

const getMyBusiness = async (userUuid) => {
    const user = await userRepository.findByUuid(userUuid);
    if (!user) throw new Error('Usuario no encontrado');
    
    const business = await businessRepository.findByUserId(user.id);
    if (business) {
        const sold = await businessRepository.countSoldItems(business.id);
        business.setDataValue('total_jobs', sold);
    }
    return business;
};

const getBusinessById = async (id) => {
    const business = await businessRepository.findById(id);
    if (business) {
        const sold = await businessRepository.countSoldItems(business.id);
        business.setDataValue('total_jobs', sold);
    }
    return business;
};

const getAllBusinesses = async () => {
    return await businessRepository.findAll();
};

module.exports = {
    upsertBusiness,
    getMyBusiness,
    getBusinessById,
    getAllBusinesses
};