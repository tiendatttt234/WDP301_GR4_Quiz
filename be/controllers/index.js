const loginController = require("./Account.controller");
const registerController = require("./Account.controller");
const getAccountController = require("./Account.controller");
const QuizController = require("./quiz.controller");
const QuestionFileController = require("./questionFile.controller");
const updateAccountController = require("./Account.controller");

module.exports = {
  registerController,
  loginController,
  getAccountController,
  //nhét hết phần login register vào chung 1 controller
  QuizController,
  QuestionFileController,
  updateAccountController,
};

