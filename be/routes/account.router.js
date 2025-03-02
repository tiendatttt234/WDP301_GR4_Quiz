const express = require("express");
const accountRouter = express.Router();
const {
  loginController,
  registerController,
  getAccountController,
  updateAccountController,
  changePasswordController,
  forgetPassword,
  resetPassword,
} = require("../controllers/Account.controller");

// Định tuyến cho đăng ký và đăng nhập
accountRouter.post("/register", registerController);
accountRouter.post("/login", loginController);
accountRouter.get("/profile/:id", getAccountController);
accountRouter.patch("/profile/:id", updateAccountController);
accountRouter.patch("/:id/change-password", changePasswordController);
accountRouter.post("/forgot-password", forgetPassword);
accountRouter.post("/reset-password/:id/:token", resetPassword);

module.exports = accountRouter;
