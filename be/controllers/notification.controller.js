const NotificationService = require("../services/notification.service");

async function notifyQuestionViolation(req, res, next) {
  try {
    const { recipientId, type, message } = req.body;
    
    const notification = await NotificationService.sendNotification(recipientId, type, message);

    // Phát thông báo qua Socket.IO
    if (global.onlineUsers.has(recipientId)) {
      const recipientSocketId = global.onlineUsers.get(recipientId);
      global.io.to(recipientSocketId).emit("newNotification", notification);
      console.log(`Notification sent to user ${recipientId} with socket ID ${recipientSocketId}`);
    } else {
      console.log(`User ${recipientId} is not online`);
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
}

  async function getNotifications(req, res, next) {
    try {
      const { userId } = req.params;
      console.log("userId", userId);
      
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
