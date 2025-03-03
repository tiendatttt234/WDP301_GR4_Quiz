const NotificationService = require("../services/notification.service");

  async function notifyQuestionViolation(req, res, next) {
    try {
      const { recipientId,type, message } = req.body;
      const notification = await NotificationService.sendNotification(recipientId, type, message);
      res.status(201).json({ success: true, notification });
    } catch (error) {
      next(error);
    }
  }

  async function getNotifications(req, res, next) {
    try {
      const { userId } = req.params;
      const notifications = await NotificationService.getUserNotifications(userId);
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      next(error);
    }
  }

  async function markAsRead(req, res, next) {
    try {
      const { notificationId } = req.params;
      const updatedNotification = await NotificationService.markNotificationAsRead(notificationId);
      res.status(200).json({ success: true, notification: updatedNotification });
    } catch (error) {
      next(error);
    }
  }

const NotificationController = {
    notifyQuestionViolation,
    getNotifications,
    markAsRead,
};
module.exports =  NotificationController;
