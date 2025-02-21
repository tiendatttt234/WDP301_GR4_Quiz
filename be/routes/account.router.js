const express = require("express");
const accountRouter = express.Router();
const {
  loginController,
  registerController,
  getAccountController,
  updateAccountController,
} = require("../controllers/Account.controller");

// Định tuyến cho đăng ký và đăng nhập
accountRouter.post("/register", registerController);
accountRouter.post("/login", loginController);
accountRouter.get("/profile/:id", getAccountController);
accountRouter.patch("/profile/:id", updateAccountController);

module.exports = accountRouter;
