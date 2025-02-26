const { create } = require("../models/Account");
const questionRepository = require("../repositories/questionFile.repository");
async function getAllQuestionFiles() {
  return await questionRepository.getAll();
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
async function createQuestionFile(data) {
  const newData = {
    ...data,
    reportedCount: 0,
    isReported: false
  };
  return await questionRepository.createQF(newData);
}

async function updateQuestionFile(id, updateData) {
  return await questionRepository.updateQF(id, updateData);
}

async function deleteQuestionFile(id) {
  return await questionRepository.deleteQF(id);
}

async function getQuestionFileByIdandUserId(id, userId) {
  const questionFile = await questionRepository.findByIdAndUserId(id, userId);

  if (!questionFile) {
    throw new Error("Question file not found");
  }

  return {
    name: questionFile.name,
    description: questionFile.description,
    isPrivate: questionFile.isPrivate,
    createBy: {
      id: questionFile.createdBy._id, 
      userName: questionFile.createdBy.userName, 
    },
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
    createdAt: questionFile.createdAt,
    updatedAt: questionFile.updatedAt,
  };
}

module.exports = {
  getAllQuestionFiles,
  getQuestionFileById,
  createQuestionFile,
  updateQuestionFile,
  deleteQuestionFile,
  getQuestionFileByIdandUserId
};
