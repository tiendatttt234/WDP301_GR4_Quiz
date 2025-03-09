const express = require("express");
const NotificationController = require("../controllers/notification.controller");

const NotificationRouter = express.Router();

NotificationRouter.post("/notify", NotificationController.notifyQuestionViolation);
NotificationRouter.get("/:userId", NotificationController.getNotifications);
NotificationRouter.patch("/:notificationId/read", NotificationController.markAsRead);

module.exports = NotificationRouter;
