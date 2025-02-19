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

async function getQuiz(req, res, next) {
  try {
      const { id } = req.params;
      console.log("id", id);
      
      const result = await QuizService.getQuizById(id);
      return res.status(result.statusCode).json(result);
  } catch (error) {
      next(error);
  }
};

async function createQuiz(req, res, next) {
  try {
      const { quizName, userId, questionFileId, questionCount } = req.body;
      const newQuiz = await QuizService.createQuiz({ quizName, userId, questionFileId, questionCount });

      return res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
      return res.status(400).json({ message: error.message });
  }
}

async function submitQuiz(req, res, next) {
  try {
      const quizResult = await QuizService.submitQuiz(req.body);
      res.status(200).json({ quizResult });
  } catch (error) {
      next(error);
  }
}

async function getAllQuizResultByUserId(req, res, next) {
  try {
      const { userId } = req.body;
      console.log("Received data from client:", userId);

      const results = await QuizService.getAllQuizResultByUserId(userId);
      res.status(200).json(results);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
}

const QuizController ={
    getAllQuiz,
    getQuizByUser,
    getQuiz,
    createQuiz,
    submitQuiz,
    getAllQuizResultByUserId
}

module.exports = QuizController;


