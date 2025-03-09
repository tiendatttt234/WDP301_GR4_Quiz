const quizRepository = require("./quiz.repository");
const quizResultRepository = require("./quizResult.repository");
const questionFileRepository = require("./questionFile.repository");
const getAccountByEmail = require("./Account.repository");
const validatePassword = require("./Account.repository");
const getAccountById = require("./Account.repository");
const getAccountByUserName = require("./Account.repository");
const hashPassword = require("./Account.repository");
const getUserRole = require("./Account.repository");
const createAccount = require("./Account.repository");
const updateAccountById = require("./Account.repository");
const changePassword = require("./Account.repository");
const NotificationRepository = require("./notification.repository");
const findByEmail = require("./Account.repository");
const findById = require("./Account.repository");
const updatePassword = require("./Account.repository");
module.exports = {
  quizRepository,
  quizResultRepository,
  questionFileRepository,
  NotificationRepository,
  getAccountById,
  getAccountByUserName,
  hashPassword,
  getUserRole,
  createAccount,
  getAccountByEmail,
  validatePassword,
  updateAccountById,
  changePassword,
  findByEmail,
  findById,
  updatePassword,
};
