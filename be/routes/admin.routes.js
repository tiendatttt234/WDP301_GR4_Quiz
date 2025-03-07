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
router.put("/reports/:reportId/status", ReportController.updateReportStatus);
router.put("/reports/:reportId/action", ReportController.lockOrDeleteQuestionFile);

module.exports = router;
