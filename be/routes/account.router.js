const express = require("express");
const accountRouter = express.Router();
const {
  loginController,
  registerController,
} = require("../controllers/Account.controller");

// Định tuyến cho đăng ký và đăng nhập
accountRouter.post("/register", registerController);
accountRouter.post("/login", loginController);

module.exports = accountRouter;
