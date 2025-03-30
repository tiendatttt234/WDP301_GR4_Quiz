const QuestionFile = require("../models/QuestionFile");

async function findQuestionFileById(id) {
  return await QuestionFile.findById(id).populate("createdBy", "userName");
}

// async function findAllQFByUserId(userId){
//     return await QuestionFile.find({createdBy: userId});
// }
//Cần lấy ra những trường gì trong collection thì dùng .select + tên trường
//ex: .select("name description arrayQuestion createdAt isPrivate")

async function findByIdAndUserId(id, userId) {
  return await QuestionFile.findOne({ _id: id, createdBy: userId }).populate(
    "createdBy",
    "userName"
  );
}
async function getAllWithUser() {
  // return await QuestionFile.find({})
  //   .select("name description createdAt updatedAt isPrivate isReported reportedCount isLocked")
  return await QuestionFile.findOne({ _id: id, createdBy: userId }).populate(
    "createdBy",
    "userName"
  );
}
async function getAllWithUser() {
  return await QuestionFile.find({})
    .select(
      "name description createdAt updatedAt isPrivate isReported reportedCount isLocked"
    )
    .populate("createdBy", "userName _id");
}
async function getAll() {
  return await QuestionFile.find({})
    .sort({ createdAt: -1 })
    .select("name description arrayQuestion createdAt isPrivate")
    .populate("createdBy", "userName");
}

async function getAllByUserId(userId) {
  return await QuestionFile.find({ createdBy: userId })
    .sort({ createdAt: 1 })
    .select("name description arrayQuestion createdAt isPrivate");
}
async function createQF(data) {
  return await QuestionFile.create({
    ...data,
    reportedCount: 0,
    isReported: false,
  });
}

async function updateQF(id, updateData) {
  return await QuestionFile.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteQF(id) {
  return await QuestionFile.findByIdAndDelete(id);
}

async function updateQuestionInFile(fileId, questionId, updatedQuestion) {
  return await QuestionFile.findOneAndUpdate(
    { _id: fileId, "arrayQuestion._id": questionId },
    {
      $set: {
        "arrayQuestion.$.content": updatedQuestion.content,
        "arrayQuestion.$.type": updatedQuestion.type,
        "arrayQuestion.$.answers": updatedQuestion.answers,
      },
    },
    { new: true }
  );
}
async function addQuestion(questionFileId, questionData) {
  const questionFile = await QuestionFile.findById(questionFileId);
  if (!questionFile) {
    throw new Error('Không tìm thấy học phần');
  }

  questionFile.arrayQuestion.push(questionData);
  await questionFile.save();
  const newQuestion = questionFile.arrayQuestion[questionFile.arrayQuestion.length - 1];
  return newQuestion;
}

async function deleteQuestion(questionFileId, questionId) {
  const questionFile = await QuestionFile.findById(questionFileId);
  if (!questionFile) {
    throw new Error('QuestionFile not found');
  }

  const questionIndex = questionFile.arrayQuestion.findIndex(
    (q) => q._id.toString() === questionId
  );
  if (questionIndex === -1) {
    throw new Error('Question not found');
  }

  questionFile.arrayQuestion.splice(questionIndex, 1);
  await questionFile.save();
  return questionFile;
}

async function updatePrivacy(fileId, isPrivate) {
  return await QuestionFile.findByIdAndUpdate(
    fileId,
    { $set: { isPrivate } }, // Chỉ cập nhật isPrivate
    { new: true }
  );
}

// async function createTxt(data) {
//   const questionFile = new QuestionFile({
//     ...data,
//     reportedCount: 0,
//     isReported: false,
//   });
//   return await questionFile.save();
// }
async function findAllByUserId(userId) {
  return await QuestionFile.find({ createdBy: userId }).populate({
    path: "createdBy",
    select: "userName",
  });
}

const questionFileRepository = {
  findQuestionFileById,
  getAllByUserId,
  findByIdAndUserId,
  createQF,
  updateQF,
  deleteQF,
  getAll,
  updateQuestionInFile,
  updatePrivacy,
  // createTxt,
  getAllWithUser,
  findAllByUserId,
  addQuestion,
  deleteQuestion
};

module.exports = questionFileRepository;
