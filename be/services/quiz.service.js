
const { quizRepository } = require("../repositories");
const mongoose = require("mongoose");
const QuestionFile = require("../models/QuestionFile");

async function getAllQuiz() {
  return await quizRepository.findAllQuiz();
}

async function getQuizByUserId(userId) {
  //Check userId co khong
  if (!userId) {
    throw new Error("userId is required");
  }
  return await quizRepository.getQuizByUserId(userId);
}

async function getQuizById(id) {
  const quiz = await quizRepository.findQuizByIdFilter(id);

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

async function createQuiz({ name, user, questionFileId, questionCount }) {
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(questionFileId)) {
    throw new Error("Invalid userId or questionFileId"); // Thay vì dùng res
  }
  
  // Fetch question file
  const questionFile = await QuestionFile.findById(questionFileId);
  
  if (!questionFile) {
    throw new Error("Question file not found");
  }
  
  // Validate question count
  if (questionCount > questionFile.arrayQuestion.length) {
    throw new Error("Question count exceeds the number of questions in the question file"); // Thay vì dùng res
  }

  
  // Select random questions
  const allQuestions = questionFile.arrayQuestion.map(q => q._id);
  const getRandomQuestions = (questions, count) => {
    const selected = new Set();
    while (selected.size < count) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      selected.add(questions[randomIndex]);
    }
    return Array.from(selected);
  };

  const randomListQuestions = getRandomQuestions(allQuestions, questionCount);
  
  // Create quiz object
  const quizData = {
    quizName: name,
    duration: 30,
    questionFile: questionFileId,
    selectedQuestions: randomListQuestions,
    createdBy: user,
  };

  
  return await quizRepository.createQuiz(quizData);
};


async function submitQuiz({ quizId, answers }) {
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    throw new Error("Invalid quiz ID");
  }

  const quiz = await quizRepository.findQuizByIdFilter(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const questionFileId = quiz.questionFile?._id;
  const userId = quiz.createdBy;

  if (!questionFileId) {
    throw new Error("Question file not found in quiz data");
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const questionFile = await QuestionFile.findById(questionFileId);
  if (!questionFile) {
    throw new Error("Question file not found");
  }

  if (!answers || !Array.isArray(answers)) {
    throw new Error("Answers must be a valid array");
  }

  let correctAnswersCount = 0;

  answers.forEach(userAnswer => {
    const question = questionFile.arrayQuestion.find(file => file?._id.toString() === userAnswer.questId);
    console.log("question", question);
    
    const isCorrect = isAnswerCorrect(question, userAnswer);
    if (isCorrect) correctAnswersCount++;
  });

  const quizResultData = {
    createBy: userId,
    quizId,
    correctAnswersCount
  };

  const result = await quizRepository.saveQuizResult(quizResultData);

  return {
    statusCode: 200,
    data: {
      quizId: result.quizId,
      correctAnswersCount: result.correctAnswersCount
    }
  };
}

// Hàm isAnswerCorrect giữ nguyên từ yêu cầu của bạn
function isAnswerCorrect(question, userAnswer) {
  if (!question || !userAnswer.selectedAnswerIds) return false;

  // Chuyển selectedAnswerIds thành mảng nếu nó là chuỗi
  const userSelectedIds = Array.isArray(userAnswer.selectedAnswerIds) 
    ? userAnswer.selectedAnswerIds 
    : [userAnswer.selectedAnswerIds];

  if (question.type === "MAQ") {
    const correctAnswerIds = question.answers.filter(a => a.isCorrect).map(a => a._id.toString());
    return (
      userSelectedIds.length === correctAnswerIds.length &&
      userSelectedIds.every(id => correctAnswerIds.includes(id))
    );
  } else {
    const correctAnswerId = question.answers.find(a => a.isCorrect)?._id.toString();
    return userSelectedIds[0] === correctAnswerId;
  }
}

async function getAllQuizResultByUserId(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
  }

  const quizResults = await quizRepository.findQuizResultsByUserId(userId);

  if (!quizResults || quizResults.length === 0) {
      throw new Error("No quiz results found for this user.");
  }

  return quizResults.map(result => {
      const evaluatedAnswers = result.userAnswers.map(userAnswer => {
          const question = result.questionFile.arrayQuestion.find(q => q._id.toString() === userAnswer.questionId);
          return {
              questionId: userAnswer.questionId,
              answers: userAnswer.answers,
              isCorrect: question ? isAnswerCorrect(question, userAnswer) : false
          };
      });

      return {
          quizId: result.quiz._id,
          quizName: result.quiz.quizName,
          duration: result.quiz.duration,
          questionFileId: result.questionFile._id,
          questionFileName: result.questionFile.name,
          correctAnswersCount: result.correctAnswersCount,
          evaluatedAnswers,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt
      };
  });
};

const QuizService = {
  getAllQuiz,
  getQuizByUserId,
  getQuizById,
  createQuiz,
  submitQuiz,
  getAllQuizResultByUserId
}

module.exports = QuizService;

