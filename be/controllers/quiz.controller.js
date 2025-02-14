const { getQuizByUserId } = require("../repositories/quiz.repository");
const {QuizService} = require("../services");

async function getAllQuiz(req, res, next) {
  try {
    const listQuiz = await QuizService.getAllQuiz();

    return res.status(200).json({ 
      success: true, 
      quizResponse: listQuiz 
    });
  } catch (error) {
    console.error("Error in getAllQuiz:", error);
    next(error);
  }
}


async function getQuizByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const listUserQuiz = await QuizService.getQuizByUserId(userId);
    return res.status(200).json({
      success: true,
      quizResponse: listUserQuiz
    });
  } catch (error) {
    console.error("Error in getQuizByUserId:", error);
    next(error);
    
  }

}

const QuizController ={
    getAllQuiz,
    getQuizByUser
}

module.exports = QuizController;


