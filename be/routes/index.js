const accountRouter = require("./account.router");
const quizRouter = require('./quiz.route');
const questionBankRouter = require('./questionFile.route');
const exportRouter = require('./Export.route');
module.exports = {
  accountRouter,
  quizRouter,
  questionBankRouter,
  exportRouter
};
