const accountRouter = require("./account.router");
const quizRouter = require('./quiz.route');
const questionBankRouter = require('./questionFile.route');
const exportRouter = require('./Export.route');
const notificationRouter = require('./notifycation.route');
const reportRouter = require('./report.router');
const transactionRouter = require("./Transaction.route");
const premiumRouter = require("./premium.route");
module.exports = {
  accountRouter,
  quizRouter,
  questionBankRouter,
  exportRouter,
  notificationRouter,
  reportRouter,
  transactionRouter,
  premiumRouter
};
