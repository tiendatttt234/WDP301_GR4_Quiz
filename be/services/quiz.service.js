
const {quizRepository} = require("../repositories");

async function getAllQuiz() {
  return await quizRepository.findAllQuiz();
}

async function getQuizByUserId(userId){
  //Check userId co khong
  if(!userId){
    throw new Error("userId is required");
  }

  //TH userId khong ton tai

  return await quizRepository.getQuizByUserId(userId);
}

const QuizService = { 
    getAllQuiz,
    getQuizByUserId
}

module.exports = QuizService;

