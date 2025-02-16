
const { quizRepository } = require("../repositories");

async function getAllQuiz() {
  return await quizRepository.findAllQuiz();
}

async function getQuizByUserId(userId) {
  //Check userId co khong
  if (!userId) {
    throw new Error("userId is required");
  }

  //TH userId khong ton tai

  return await quizRepository.getQuizByUserId(userId);
}

const getQuizById = async (id) => {
  const quiz = await quizRepository.findQuizByIdFilter(id);
  console.log("quiz service", quiz);

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  if (!quiz.questionFile || !quiz.questionFile.arrayQuestion) {
    throw new Error("Question file or questions not found");
  }


  const selectedQuestions = quiz.selectedQuestions
    .map((questionId) => {
      const question = quiz.questionFile.arrayQuestion.find((q) => q && q._id.equals(questionId));
      return question
        ? {
          questionFileId: quiz.questionFile._id,
          questId: question._id,
          content: question.content,
          type: question.type,
          answers: question.answers.map((answer) => ({
            answerId: answer._id,
            text: answer.answerContent,
          })),
        }
        : null;
    })
    .filter(Boolean);

  return {
    statusCode: 200,
    data: {
      id: quiz._id,
      name: quiz.quizName,
      duration: quiz.duration,
      questionFileId: quiz.questionFile._id,
      questionFileName: quiz.questionFile.name,
      questions: selectedQuestions,
    },
  };
};

const QuizService = {
  getAllQuiz,
  getQuizByUserId,
  getQuizById
}

module.exports = QuizService;

