const { 
    Quiz,
 }  = require("../models");

async function findAllQuiz(){
    return await Quiz.findAll();
}

async function findQuizById(id) {
    return await Quiz.findById(id)
        .populate({
            path: " questionFile",
            select:"_id name arrayQuestion"
        })
        .lean();
}

async function createQuiz(quizData) {
    return await Quiz.create(quizData);
}


const quizRepository = {
    findAllQuiz,
    findQuizById,
    createQuiz,
};
module.exports = quizRepository;

