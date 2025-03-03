const express = require("express");
const NotificationController = require("../controllers/notification.controller");

const router = express.Router();

router.post("/notify", NotificationController.notifyQuestionViolation);
router.get("/:userId", NotificationController.getNotifications);
router.patch("/:notificationId/read", NotificationController.markAsRead);

module.exports = router;
