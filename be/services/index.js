
const QuizService = require('./quiz.service');
const questionFileService = require('./questionFile.service');
const AccountService = require("./Account.service");
const NotificationService = require("./notification.service");
const ReportService = require('./report.service');
const favoriteService = require('./favorite.service');
module.exports = {
  QuizService,
  questionFileService,
  AccountService,
  NotificationService,
  ReportService,
  favoriteService
};
