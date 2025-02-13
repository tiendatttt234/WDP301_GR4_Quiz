const express = require("express");
const LoginRouter = express.Router();
const { loginController } = require("../controllers/Account.controller");

LoginRouter.post("/login", loginController);

module.exports = LoginRouter;
