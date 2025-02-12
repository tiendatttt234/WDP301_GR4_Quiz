const questionRepository = require('../repositories/questionFile.repository');
async function getAllQuestionFiles(userId) {
    if (!userId) {
      throw new Error("userId is required");
    }
    return await questionRepository.getAllByUserId(userId);
  }
  module.exports = {
        getAllQuestionFiles
  }