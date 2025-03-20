const { 
    Quiz,
    QuizResult
 }  = require("../models");

async function findAllQuiz(){
    return await Quiz.find();
}

async function findQuizByIdFilter(id) {
    return await Quiz.findById(id)
    .populate({
        path: "questionFile",
        select:"_id name arrayQuestion createdBy"
    })
        .lean();
}

async function createQuiz(quizData) {
    console.log("quiz err", quizData);
    
    return await Quiz.create(quizData);
}

async function getQuizByUserId(userId) {
    return await Quiz.find({createdBy: userId});
}

async function saveQuizResult(quizResultData) {
    const quizResult = new QuizResult(quizResultData);
    return await quizResult.save();
}

async function findQuizResultsByUserId(userId) {
    return await QuizResult.find({ user: userId })
        .populate({
            path: 'quiz',
            select: 'quizName duration'
        })
        .populate({
            path: 'questionFile',
            select: 'name arrayQuestion'
        })
        .exec();
  };

const quizRepository = {
    findAllQuiz,
    findQuizByIdFilter,
    createQuiz,
    getQuizByUserId,
    saveQuizResult,
    findQuizResultsByUserId
};
module.exports = quizRepository;

