
const QuestionFile = require("../models/QuestionFile");

async function findQuestionFileById(id){
    return await QuestionFile.findById(id);
}

async function findAllQFByUserId(userId){
    return await QuestionFile.find({createdBy: userId});
}
//Cần lấy ra những trường gì trong collection thì dùng .select + tên trường
//ex: .select("name description arrayQuestion createdAt isPrivate")

async function findByIdAndUserId(id, userId){
    return await QuestionFile.findOne({_id: id, createdBy: userId});    
}

async function createQF(data){
    return await QuestionFile.create(data);
}

const questionFileRepository = {
    findQuestionFileById,
    findAllQFByUserId,
    findByIdAndUserId,
    createQF
};

module.exports = questionFileRepository;


