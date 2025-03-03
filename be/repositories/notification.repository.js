const {Notification} = require("../models");


  async function createNotification(data) {
    return await Notification.create(data);
  }

  async function getNotificationsByRecipient(recipientId) {
    return await Notification.find({ recipient: recipientId }).sort({ createdAt: -1 });
  }

  async function markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }

  const NotificationRepository = {
    createNotification,
    getNotificationsByRecipient,
    markAsRead
  };

module.exports = NotificationRepository;
