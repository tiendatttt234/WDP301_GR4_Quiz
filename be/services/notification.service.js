const NotificationRepository = require("../repositories/notification.repository");


  async function sendNotification(recipientId, type, message) {
    const notification = await NotificationRepository.createNotification({
      recipient: recipientId,
      type,
      message,
    });

    // Gửi thông báo qua socket.io
    if (global.io) {
      global.io.to(recipientId.toString()).emit("newNotification", notification);
    }

    return notification;
  }

  async function getUserNotifications(recipientId) {
    return await NotificationRepository.getNotificationsByRecipient(recipientId);
  }

  async function markNotificationAsRead(notificationId) {
    return await NotificationRepository.markAsRead(notificationId);
  }

const NotificationService = {
    sendNotification,
    getUserNotifications,
    markNotificationAsRead
}
module.exports =  NotificationService;
