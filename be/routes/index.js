const accountRouter = require("./account.router");
const quizRouter = require('./quiz.route');
const questionBankRouter = require('./questionFile.route');
const exportRouter = require('./Export.route');
const notificationRouter = require('./notifycation.route');
const reportRouter = require('./report.router');
module.exports = {
  accountRouter,
  quizRouter,
  questionBankRouter,
  exportRouter,
  notificationRouter,
  reportRouter
};
