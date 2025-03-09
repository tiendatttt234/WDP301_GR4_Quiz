const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/admin/adminController");
const ReportController = require("../controllers/admin/reportController");
const { NotificationService } = require("../services");
const multer = require('multer');
const { 
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog 
} = require('../controllers/admin/admin.blog'); 
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// API get account by admin
router.get("/accounts", AccountController.getAllAccounts);

// API lock account
router.put("/accounts/:id/lock", AccountController.islockAccount);
//api dashboard
router.get("/dashboard", AccountController.getDashboardStats);
//api statistics
router.get("/statistics", AccountController.getUserStatistics);
router.get("/quiz-statistics", AccountController.getQuestionStatistics);
router.get("/reports", ReportController.getReportsList);
router.get("/reports/:reportId/details", ReportController.getReportDetails);
router.delete("/reports/:reportId", ReportController.deleteReport);

// Blog Routes
router.route('/blogs')
    .post(upload.single('image'), createBlog) 
    .get(getAllBlogs); 

router.route('/blogs/:id')
    .get(getBlogById) 
    .put(upload.single('image'), updateBlog) 
    .delete(deleteBlog); 

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