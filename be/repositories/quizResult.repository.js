const QuizResult = require("../models/QuizResult");

async function saveQuizResult(data){
    const quizResult = new QuizResult(data);
    return await QuizResult.create(quizResult);
}

async function findQuizResultByUserId(userId){
    const result =  await QuizResult.find({createdBy: userId})
    .populate({
        path: 'quizId',
        select: 'quizName' 
    });
    return result;
    
    

}

const quizResultRepository = {
    saveQuizResult,
    findQuizResultByUserId
};

module.exports = quizResultRepository;