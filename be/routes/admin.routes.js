const express = require("express");
const router = express.Router();
const adminStatitics = require("../controllers/admin/adminStatitics");
const ReportController = require("../controllers/admin/reportController");
const AccountController = require("../controllers/admin/accountManagement");
const { NotificationService } = require("../services");
const multer = require('multer');
const { 
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog 
} = require('../controllers/admin/admin.blog'); 
const premiumPackageController = require('../controllers/admin/settingPremium'); 
const { verifyAccessToken, isAdmin } = require('../middlewares/jwt_helper'); 

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
router.get("/accounts",   AccountController.getAllAccounts);

// API lock account
router.put("/accounts/:id/lock", AccountController.islockAccount);
// API dashboard
router.get("/dashboard", adminStatitics.getDashboardStats);
// API statistics
router.get("/statistics", adminStatitics.getUserStatistics);
router.get("/quiz-statistics", adminStatitics.getQuestionStatistics);
router.get("/revenue", adminStatitics.getRevenueStatistics);
//api manage reports
router.get("/reports", ReportController.getReportsList);
router.get("/reports/:reportId/details", ReportController.getReportDetails);
router.delete("/reports/:reportId", ReportController.deleteReport);
router.put("/reports/:reportId/status", ReportController.updateReportStatus);
router.put("/reports/:reportId/action", ReportController.lockOrDeleteQuestionFile);

// Blog Routes
router.route('/blogs')
    .post(upload.single('image'), createBlog) 
    .get(getAllBlogs); 

router.route('/blogs/:id')
    .get(getBlogById) 
    .put(upload.single('image'), updateBlog) 
    .delete(deleteBlog); 

// Setting Premium Package
router.post(
  '/admin/premium-packages',
  verifyAccessToken,
  isAdmin,
  premiumPackageController.createPremiumPackage
);
router.get(
  '/admin/premium-packages',
  verifyAccessToken,
  isAdmin,
  premiumPackageController.getAllPremiumPackages
);
router.get(
  '/admin/premium-packages/:id',
  verifyAccessToken,
  isAdmin,
  premiumPackageController.getPremiumPackageById
);
router.put(
  '/admin/premium-packages/:id',
  verifyAccessToken,
  isAdmin,
  premiumPackageController.updatePremiumPackage
);
router.delete(
  '/admin/premium-packages/:id',
  verifyAccessToken,
  isAdmin,
  premiumPackageController.deletePremiumPackage
);

module.exports = router;
