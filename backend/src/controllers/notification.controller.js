import Notification from "../models/Notification.model.js";

/**
 * ===============================
 * GET MY NOTIFICATIONS
 * ===============================
 */
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            total: notifications.length,
            notifications
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * MARK NOTIFICATION AS READ
 * ===============================
 */
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read"
        });
    } catch (error) {
        console.error("Mark notification error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

