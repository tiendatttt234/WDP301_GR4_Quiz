const questionRepository = require('../repositories/questionFile.repository');
async function getAllQuestionFiles(userId) {
    if (!userId) {
      throw new Error("userId is required");
    }
    return await questionRepository.getAllByUserId(userId);
  }

  async function getQuestionFileById(id) {
    const questionFile = await questionRepository.findQuestionFileById(id);
  
    if (!questionFile) return null;
  
    return {
      name: questionFile.name,
      description: questionFile.description,
      isPrivate: questionFile.isPrivate,
      arrayQuestion: questionFile.arrayQuestion.map((question) => ({
        questionId: question._id,
        content: question.content,
        type: question.type,
        answers: question.answers.map((answer) => ({
          answerId: answer._id,
          answerContent: answer.answerContent,
          isCorrect: answer.isCorrect,
        })),
      })),
    };
  }
  module.exports = {
        getAllQuestionFiles, getQuestionFileById
  }