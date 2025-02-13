const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const createError = require("http-errors");

async function getAccountByEmail(email) {
  try {
    const account = await Account.findOne({ email }).populate("roles").exec();
    if (!account) {
      throw createError.NotFound("Người dùng không tồn tại");
    }
    return account;
  } catch (error) {
    throw error;
  }
}

async function validatePassword(inputPassword, accountPassword) {
  try {
    if (inputPassword === accountPassword) {
      return true;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAccountByEmail,
  validatePassword,
};
