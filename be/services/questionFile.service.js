const { create } = require("../models/Account");
const questionRepository = require("../repositories/questionFile.repository");
const fs = require('fs');
const path = require('path');
const QuestionFile = require("../models/QuestionFile");
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
    isLocked: qf?.isLocked || false,
    userId: qf.createdBy?._id || "N/A",
    userName: qf.createdBy?.userName || "N/A",
    createdAt: qf.createdAt,
    updatedAt: qf.updatedAt,
  }));
  return formatQF;
}


async function getQuestionFileByUserId(userId) {
  try {
    return await QuestionFile.find({ createdBy: userId })
      .sort({ createdAt: 1 })
      .select("name description arrayQuestion createdAt isPrivate");
  } catch (error) {
    throw new Error("Error retrieving question files: " + error.message);
  }
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

function parseTxtFile(content) {
  const lines = content.split("\n").map((line) => line.trim());
  // Trường hợp file trắng
  if (lines.length === 0 || lines.every((line) => !line)) {
    throw new Error("File .txt rỗng, vui lòng nhập nội dung.");
  }

  let name = "";
  let description = "";
  let isPrivate;
  const questions = [];
  let currentQuestion = null;
  let inQuestionSection = false;
  const warnings = [];

  lines.forEach((line, index) => {
    if (line.startsWith("Chủ đề:")) {
      name = line.replace("Chủ đề:", "").trim();
    } else if (line.startsWith("Mô tả:")) {
      description = line.replace("Mô tả:", "").trim();
    } else if (line.startsWith("Công khai:")) {
      isPrivate = line.replace("Công khai:", "").trim() === "Không";
    } else if (line.startsWith("Danh sách câu hỏi:")) {
      inQuestionSection = true;
    } else if (inQuestionSection) {
      // Phát hiện câu hỏi: Có số thứ tự hoặc dòng mới
      if (line.match(/^\d+\./) || (!currentQuestion && line && !line.match(/^[a-e]\./))) {
        if (currentQuestion) {
          // Kiểm tra câu hỏi có đáp án không
          if (currentQuestion.answers.length === 0) {
            warnings.push(`Câu hỏi "${currentQuestion.content}" không có đáp án.`);
          }
          questions.push(currentQuestion);
        }
        // Xử lý ký tự đặc biệt
        let cleanedLine = line.replace(/[@#$%]+/g, "").trim();
        if (!cleanedLine) {
          warnings.push(`Dòng ${index + 1}: Nội dung không hợp lệ (chỉ chứa ký tự đặc biệt).`);
          return;
        }
        const [questionText, type] = cleanedLine.split("(").map((part) => part.trim());
        currentQuestion = {
          content: questionText.replace(/^\d+\.\s*/, "").trim() || cleanedLine.trim(),
          type: type && type.includes(")") ? type.replace(")", "").trim() === "Boolean" ? "Boolean" : type.replace(")", "").trim() === "MAQ" ? "MAQ" : "MCQ" : "MCQ",
          answers: [],
        };
        if (!line.match(/^\d+\./)) {
          warnings.push(`Dòng ${index + 1}: Thiếu số thứ tự cho câu hỏi, tự động gán.`);
        }
      }
      // Phát hiện đáp án: Có thể bắt đầu bằng a-e hoặc dòng mới
      else if (currentQuestion && (line.match(/^[a-e]\./) || (line && !line.match(/^\d+\./)))) {
        // Xử lý ký tự đặc biệt
        let cleanedLine = line.replace(/[@#$%]+/g, "").trim();
        if (!cleanedLine) {
          warnings.push(`Dòng ${index + 1}: Đáp án không hợp lệ (chỉ chứa ký tự đặc biệt).`);
          return;
        }
        const [answerText, correctText] = cleanedLine.split("(").map((part) => part.trim());
        const answerContent = answerText.replace(/^[a-e]\.\s*/, "").trim() || cleanedLine.trim();
        const isCorrect = correctText && correctText.includes(")") ? correctText.replace(")", "").trim() === "Đúng" : false;
        currentQuestion.answers.push({ answerContent, isCorrect });
        if (!line.match(/^[a-e]\./)) {
          warnings.push(`Dòng ${index + 1}: Thiếu ký tự a-e cho đáp án, tự động gán.`);
        }
      }
      // Trường hợp viết liền: Tách từ sau câu hỏi
      else if (currentQuestion && !line.match(/^\d+\./) && !line.match(/^[a-e]\./) && line.includes(currentQuestion.content)) {
        const remainingText = line.replace(currentQuestion.content, "").trim();
        if (remainingText) {
          const potentialAnswers = remainingText.split(/\s+/).filter((word) => word);
          potentialAnswers.forEach((answer, idx) => {
            currentQuestion.answers.push({ answerContent: answer, isCorrect: false });
          });
          warnings.push(`Dòng ${index + 1}: Định dạng viết liền được phát hiện, tự động tách thành ${potentialAnswers.length} đáp án.`);
        }
      }
      // Trường hợp chỉ có đáp án, không có câu hỏi
      else if (!currentQuestion && line.match(/^[a-e]\./)) {
        warnings.push(`Dòng ${index + 1}: Không tìm thấy câu hỏi cho đáp án "${line}".`);
      }
    }
  });

  if (currentQuestion) {
    // Kiểm tra câu hỏi cuối cùng có đáp án không
    if (currentQuestion.answers.length === 0) {
      warnings.push(`Câu hỏi "${currentQuestion.content}" không có đáp án.`);
    }
    questions.push(currentQuestion);
  }

  // Cảnh báo các trường thiếu
  if (!name) warnings.push("Thiếu trường 'Chủ đề'");
  if (!description) warnings.push("Thiếu trường 'Mô tả'");
  if (isPrivate === undefined) warnings.push("Thiếu trường 'Công khai'");
  if (questions.length === 0) throw new Error("File .txt không chứa câu hỏi nào");

  return { data: { name, description, isPrivate, questions }, warnings };
}

async function createQuestionFileFromTxt(filePath, createdBy) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, warnings } = parseTxtFile(fileContent);

  const questionFileData = {
    name: data.name || "Học phần không tên",
    description: data.description || "",
    isPrivate: data.isPrivate !== undefined ? data.isPrivate : false,
    arrayQuestion: data.questions,
    createdBy: createdBy || null,
  };

  const newQuestionFile = await questionRepository.createTxt(questionFileData);
  return { data: newQuestionFile, warnings };
}

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
  getAllQuestionFileAndUser,
  getQuestionFileByUserId
};
