const quizRepository = require("./quiz.repository");
const quizResultRepository = require("./quizResult.repository");
const questionFileRepository = require("./questionFile.repository");
const getAccountByEmail = require("./Account.repository");
const validatePassword = require("./Account.repository");
const getAccountById = require("./Account.repository");
const hashPassword = require("./Account.repository");
const getUserRole = require("./Account.repository");
const createAccount = require("./Account.repository");
const updateAccountById = require("./Account.repository");
const changePassword = require("./Account.repository");
module.exports = {
  quizRepository,
  quizResultRepository,
  questionFileRepository,
  getAccountById,
  hashPassword,
  getUserRole,
  createAccount,
  getAccountByEmail,
  validatePassword,
  updateAccountById,
  changePassword,
};
