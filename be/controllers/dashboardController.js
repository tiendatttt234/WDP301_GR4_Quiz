const Account = require('../models/Account');
const QuestionFile = require('../models/QuestionFile');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAccounts = await Account.countDocuments();
    const premiumAccounts = await Account.countDocuments({ isPrime: true });
    const totalQuestionFiles = await QuestionFile.countDocuments();

    res.status(200).json({
      totalAccounts,
      premiumAccounts,
      totalQuestionFiles,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};