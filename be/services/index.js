const loginService = require("./Account.service");
const registerService = require("./Account.service");
const getAccountService = require("./Account.service");
const updateAccountService = require("./Account.service");
const changePasswordService = require("./Account.service");

module.exports = {
  registerService,
  loginService,
  getAccountService,
  updateAccountService,
  changePasswordService,
};
