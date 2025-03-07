
const QuestionFile = require("../models/QuestionFile");

async function findQuestionFileById(id) {
  return await QuestionFile.findById(id);
}

// async function findAllQFByUserId(userId){
//     return await QuestionFile.find({createdBy: userId});
// }
//Cần lấy ra những trường gì trong collection thì dùng .select + tên trường
//ex: .select("name description arrayQuestion createdAt isPrivate")

async function findByIdAndUserId(id, userId) {
  return await QuestionFile.findOne({ _id: id, createdBy: userId })
    .populate("createdBy", "userName");
}
async function getAllWithUser(){
  return await QuestionFile.find({})
    .select("name description createdAt updatedAt isPrivate isReported reportedCount isLocked")
    .populate("createdBy", "userName _id");
}
async function getAll() {
  return await QuestionFile.find({})
    .sort({ createdAt: 1 })
    .select('name description arrayQuestion createdAt isPrivate');
}

async function getAllByUserId(userId) {
  return await QuestionFile.find({ createdBy: userId })
    .sort({ createdAt: 1 })
    .select('name description arrayQuestion createdAt isPrivate');
}
async function createQF(data) {
  return await QuestionFile.create({
    ...data,
    reportedCount: 0,
    isReported: false
  });
}

async function updateQF(id, updateData) {
  return await QuestionFile.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteQF(id) {
  return await QuestionFile.findByIdAndDelete(id);
}



const questionFileRepository = {
  findQuestionFileById,
  getAllByUserId,
  findByIdAndUserId,
  createQF, updateQF,
  deleteQF,
  getAll,
  getAllWithUser
};

module.exports = questionFileRepository;


