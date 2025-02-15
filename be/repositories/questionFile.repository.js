
const QuestionFile = require("../models/QuestionFile");

async function findQuestionFileById(id){
    return await QuestionFile.findById(id);
}

// async function findAllQFByUserId(userId){
//     return await QuestionFile.find({createdBy: userId});
// }
//Cần lấy ra những trường gì trong collection thì dùng .select + tên trường
//ex: .select("name description arrayQuestion createdAt isPrivate")

async function findByIdAndUserId(id, userId){
    return await QuestionFile.findOne({_id: id, createdBy: userId});    
}

async function createQF(data){
    return await QuestionFile.create(data);
}
async function getAllByUserId(userId) {
    return await QuestionFile.find({ createdBy: userId })
      .sort({ createdAt: 1 })
      .select('name description arrayQuestion createdAt isPrivate');
}
async function findQuestionFileById(id) {
    return await QuestionFile.findById(id);
}



const questionFileRepository = {
    findQuestionFileById,
    getAllByUserId,
    findByIdAndUserId,
    createQF
};

module.exports = questionFileRepository;


