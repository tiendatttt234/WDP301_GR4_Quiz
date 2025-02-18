const loginService = require("./Account.service");
const registerService = require("./Account.service");
const getAccountService = require("./Account.service");
const QuizService = require('./quiz.service');
const questionFileService = require('./questionFile.service');
module.exports = {
  registerService,
  loginService,
  getAccountService,
  //nhét hết phần login register vào chung 1 service
  QuizService,
  questionFileService,
};


module.exports = {
    
}
