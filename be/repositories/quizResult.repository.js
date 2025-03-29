const QuizResult = require("../models/QuizResult");

async function saveQuizResult(data){
    const quizResult = new QuizResult(data);
    return await QuizResult.create(quizResult);
}

async function findQuizResultByUserId(userId){
    console.log("findQuizResultByUserId", userId);
    
    return await QuizResult.find({createBy: userId});
}

const quizResultRepository = {
    saveQuizResult,
    findQuizResultByUserId
};

module.exports = quizResultRepository;