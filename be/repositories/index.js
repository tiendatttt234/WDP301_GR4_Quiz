const quizRepository = require("./quiz.repository");
const quizResultRepository = require("./quizResult.repository");
const questionFileRepository = require("./questionFile.repository");
const NotificationRepository = require("./notification.repository");
const ReportRepository = require("./report.repository");
const favoriteRepository = require("./favorite.repository");
const AccountRepository = require("./Account.repository");

module.exports = {
  quizRepository,
  quizResultRepository,
  questionFileRepository,
  NotificationRepository,
  ReportRepository,
  favoriteRepository,
  AccountRepository,
};
