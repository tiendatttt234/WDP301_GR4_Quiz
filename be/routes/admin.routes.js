const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/admin/adminController");
const ReportController = require("../controllers/admin/reportController");
// const { verifyAccessToken, isAdmin } = require("../middlewares/jwt_helper");
const {NotificationService} = require("../services");

// API get account by admin
router.get("/accounts", AccountController.getAllAccounts);

// API lock account
router.put("/accounts/:id/lock", AccountController.islockAccount);
router.get("/dashboard", AccountController.getDashboardStats);
router.get("/reports", ReportController.getReportsList);
router.get("/reports/:reportId/details", ReportController.getReportDetails);
router.delete("/reports/:reportId", ReportController.deleteReport);
router.post("/block-question", async (req, res, next) => {
    try {
      const { recipientId, questionBankId, action } = req.body;
  
      let message = action === "delete"
        ? "Tập câu hỏi của bạn đã bị xóa do vi phạm quy định."
        : "Tập câu hỏi của bạn đã bị khóa do vi phạm quy định.";
  
      // Gửi thông báo cho người dùng
      await NotificationService.sendNotification(recipientId, "Alert", message);
  
      res.status(200).json({ success: true, message: "Thông báo đã được gửi!" });
    } catch (error) {
      next(error);
    }
});
module.exports = router;
