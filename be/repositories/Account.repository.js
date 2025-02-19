const Account = require("../models/Account");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const createError = require("http-errors");

async function getAccountByUserName(userName) {
  try {
    return await Account.findOne({ userName }).populate("roles").exec();
  } catch (error) {
    throw error;
  }
}

async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, parseInt(process.env.PASSWORD_SECRET));
  } catch (error) {
    throw error;
  }
}

async function getUserRole() {
  try {
    const userRole = await Role.findOne({ name: "user" });
    return userRole ? [userRole._id] : [];
  } catch (error) {
    throw error;
  }
}

async function createAccount(email, userName, password, roles) {
  try {
    const newAccount = new Account({ email, userName, password, roles });
    return await newAccount.save();
  } catch (error) {
    throw error;
  }
}

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
    return await bcrypt.compare(inputPassword, accountPassword);
  } catch (error) {
    throw error;
  }
}

async function updateAccountField(userName, updateFields) {
  try {
    return await Account.findOneAndUpdate({ userName }, updateFields, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAccountByUserName,
  hashPassword,
  getUserRole,
  createAccount,
  getAccountByEmail,
  validatePassword,
  updateAccountField,
};
