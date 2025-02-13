const quizRepository = require("./quiz.repository");
const quizResultRepository = require("./quizResult.repository");
const questionFileRepository = require("./questionFile.repository");
const getAccountByEmail = require("./Account.repository");
const validatePassword = require("./Account.repository");

module.exports = {
  quizRepository,
  quizResultRepository,
  questionFileRepository,
  getAccountByEmail,
  validatePassword,
};
