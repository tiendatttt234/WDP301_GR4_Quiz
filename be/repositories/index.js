const quizRepository = require("./quiz.repository");
const quizResultRepository = require("./quizResult.repository");
const questionFileRepository = require("./questionFile.repository");
const getAccountByEmail = require("./Account.repository");
const validatePassword = require("./Account.repository");
const getAccountByUserName = require("./Account.repository");
const hashPassword = require("./Account.repository");
const getUserRole = require("./Account.repository");
const createAccount = require("./Account.repository");
module.exports = {
  quizRepository,
  quizResultRepository,
  questionFileRepository,
  getAccountByUserName,
  hashPassword,
  getUserRole,
  createAccount,
  getAccountByEmail,
  validatePassword,
};
