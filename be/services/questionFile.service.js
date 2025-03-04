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
async function updateQuestion(fileId, questionId, updatedQuestion) {
  const questionFile = await questionRepository.updateQuestionInFile(fileId, questionId, updatedQuestion);
  if (!questionFile) {
    throw new Error("Không tìm thấy tệp hoặc câu hỏi để cập nhật");
  }
  return questionFile;
}
async function updatePrivacy(fileId, isPrivate) {
  const updatedFile = await questionRepository.updatePrivacy(fileId, isPrivate);
  if (!updatedFile) {
    throw new Error("Không tìm thấy tệp để cập nhật trạng thái");
  }
  return updatedFile;
}

module.exports = {
  getAllQuestionFiles,
  getQuestionFileById,
  createQuestionFile,
  updateQuestionFile,
  deleteQuestionFile,
  updateQuestion, updatePrivacy
};
