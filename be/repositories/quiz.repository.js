const { 
    Quiz,
 }  = require("../models");

async function findAllQuiz(){
    return await Quiz.find();
}

async function findQuizByIdFilter(id) {
    return await Quiz.findById(id)
    .populate({
        path: "questionFile",
        select:"_id name arrayQuestion"
    })
        .lean();
}

async function createQuiz(quizData) {
    return await Quiz.create(quizData);
}

async function getQuizByUserId(userId) {
    return await Quiz.find({createdBy: userId});
}


const quizRepository = {
    findAllQuiz,
    findQuizByIdFilter,
    createQuiz,
    getQuizByUserId
};
module.exports = quizRepository;

