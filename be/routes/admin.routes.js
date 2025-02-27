const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/admin/adminAccountController");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt_helper");


// API get account by admin
router.get("/accounts", verifyAccessToken, isAdmin, AccountController.getAllAccounts);

// API lock account
router.put("/accounts/:id/lock", verifyAccessToken, isAdmin, AccountController.islockAccount);

module.exports = router;
