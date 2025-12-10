const Notification = require('../models/mysql/Notification');

const createNotification = async (userId, type, title, message, data = null) => {
    try {
        await Notification.create({
            user_id: userId,
            type,
            title,
            message,
            data
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Notification.findAndCountAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        const unreadCount = await Notification.count({
            where: { user_id: userId, is_read: false }
        });

        res.json({
            notifications: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            unreadCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOne({
            where: { id, user_id: userId }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        notification.is_read = true;
        await notification.save();

        res.json({ message: 'Notificación marcada como leída', notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar notificación' });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.update(
            { is_read: true },
            { where: { user_id: userId, is_read: false } }
        );

        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar notificaciones' });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await Notification.destroy({
            where: { id, user_id: userId }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.json({ message: 'Notificación eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar notificación' });
    }
};

module.exports = {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
