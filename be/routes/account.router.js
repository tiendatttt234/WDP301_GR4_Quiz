const express = require("express");
const accountRouter = express.Router();
const {
  loginController,
  registerController,
  getAccountController,
} = require("../controllers/Account.controller");

// Định tuyến cho đăng ký và đăng nhập
accountRouter.post("/register", registerController);
accountRouter.post("/login", loginController);
accountRouter.get("/:userName", getAccountController);

module.exports = accountRouter;
