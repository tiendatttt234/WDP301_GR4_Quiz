const loginService = require("./Account.service");
const registerService = require("./Account.service");
const getAccountService = require("./Account.service");
const QuizService = require('./quiz.service');
const questionFileService = require('./questionFile.service');
const updateAccountService = require("./Account.service");

module.exports = {
  registerService,
  loginService,
  getAccountService,
  //nhét hết phần login register vào chung 1 service
  // chưa nhét hết vào 1 controller à

  QuizService,
  questionFileService,
  updateAccountService,
};


module.exports = {
    
}
