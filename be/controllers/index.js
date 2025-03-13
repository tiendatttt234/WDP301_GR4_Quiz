
const QuizController = require("./quiz.controller");
const QuestionFileController = require("./questionFile.controller");
const AccountController = require("./Account.controller");
const ExportController = require("./ExportController");
const NotificationController = require("./notification.controller");
const ReportController = require('./report.controller');
const favoriteController = require('./favorite.controller');
module.exports = {

  //nhét hết phần login register vào chung 1 controller
  QuizController,
  QuestionFileController,
  AccountController,
  ExportController,
  NotificationController,
  ReportController,
  favoriteController
};

