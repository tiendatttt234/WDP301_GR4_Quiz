const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/admin/adminAccountController");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt_helper");


// API lấy danh sách tài khoản
router.get("/accounts", verifyAccessToken, isAdmin, AccountController.getAllAccounts);

// API khóa hoặc mở khóa tài khoản
router.put("/accounts/:id/lock", verifyAccessToken, isAdmin, AccountController.islockAccount);

module.exports = router;
