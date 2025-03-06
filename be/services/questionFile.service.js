const { create } = require("../models/Account");
const questionRepository = require("../repositories/questionFile.repository");
const fs = require('fs');
const path = require('path');
async function getAllQuestionFiles() {
  return await questionRepository.getAll();
}

async function getAllQuestionFileAndUser() {
  const listQF = await questionRepository.getAllWithUser();
  const formatQF = listQF.map((qf) => ({
    id: qf._id,
    name: qf.name,
    description: qf.description,
    isPrivate: qf.isPrivate,
    reportedCount: qf.reportedCount,
    isReported: qf.isReported,
    userId: qf.createdBy?._id || "N/A",
    userName: qf.createdBy?.userName || "N/A",
    createdAt: qf.createdAt,
    updatedAt: qf.updatedAt,
  }));
  return formatQF;
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
};
async function updateQuestion(fileId, questionId, updatedQuestion) {
  const questionFile = await questionRepository.updateQuestionInFile(fileId, questionId, updatedQuestion);
  if (!questionFile) {
    throw new Error("Không tìm thấy tệp hoặc câu hỏi để cập nhật");
  }
  return questionFile;
};
async function updatePrivacy(fileId, isPrivate) {
  const updatedFile = await questionRepository.updatePrivacy(fileId, isPrivate);
  if (!updatedFile) {
    throw new Error("Không tìm thấy tệp để cập nhật trạng thái");
  }
  return updatedFile;
};

async function createQuestionFileFromTxt(filePath, createdBy) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const parsedData = this.parseTxtFile(fileContent);

  const questionFileData = {
    name: parsedData.name,
    description: parsedData.description,
    isPrivate: parsedData.isPrivate === "Không",
    arrayQuestion: parsedData.questions,
    createdBy: createdBy || null,
  };

  return await questionRepository.createTxt(questionFileData);
};

function parseTxtFile(content) {
  const lines = content.split("\n").map((line) => line.trim());
  let name = "";
  let description = "";
  let isPrivate = true;
  const questions = [];
  let currentQuestion = null;
  let inQuestionSection = false;

  lines.forEach((line) => {
    if (line.startsWith("Chủ đề:")) {
      name = line.replace("Chủ đề:", "").trim();
    } else if (line.startsWith("Mô tả:")) {
      description = line.replace("Mô tả:", "").trim();
    } else if (line.startsWith("Công khai:")) {
      isPrivate = line.replace("Công khai:", "").trim() === "Không";
    } else if (line.startsWith("Danh sách câu hỏi:")) {
      inQuestionSection = true;
    } else if (inQuestionSection && line.match(/^\d+\./)) {
      if (currentQuestion) questions.push(currentQuestion);
      const [questionText, type] = line.split("(");
      currentQuestion = {
        content: questionText.replace(/^\d+\.\s*/, "").trim(),
        type: type.replace(")", "").trim() === "Boolean" ? "Boolean" : type.replace(")", "").trim() === "MAQ" ? "MAQ" : "MCQ",
        answers: [],
      };
    } else if (inQuestionSection && line.match(/^[a-e]\./)) {
      const [answerText, correctText] = line.split("(");
      const answerContent = answerText.replace(/^[a-e]\.\s*/, "").trim();
      const isCorrect = correctText.replace(")", "").trim() === "Đúng";
      currentQuestion.answers.push({ answerContent, isCorrect });
    }
  });

  if (currentQuestion) questions.push(currentQuestion);
  return { name, description, isPrivate, questions };
};

module.exports = {
  getAllQuestionFiles,
  getQuestionFileById,
  createQuestionFile,
  updateQuestionFile,
  deleteQuestionFile,
  getQuestionFileByIdandUserId,
  updateQuestion, updatePrivacy,
  createQuestionFileFromTxt,
  parseTxtFile,
  getAllQuestionFileAndUser
};
