
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

async function createQuiz({ name, user, questionFileId, questionCount }) {
  console.log("here 1", user, questionFileId);
  
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
    console.log("here 2");
    throw new Error("Question count exceeds the number of questions in the question file"); // Thay vì dùng res
  }

  console.log("here 3");
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
    name,
    duration: 30, // Default duration
    questionFile: questionFileId,
    selectedQuestions: randomListQuestions,
    createdBy: userId,
  };

  return await quizRepository.createQuiz(quizData);
};


async function submitQuiz({ userId, quizId, questionFileId, userAnswers, startTime }) {
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new Error('Invalid quiz ID');
  }

  // Lấy danh sách câu hỏi từ questionFile
  const questionFile = await QuestionFile.findById(questionFileId);
  if (!questionFile) {
      throw new Error('Question file not found');
  }

  // Tính số câu đúng
  let correctAnswersCount = 0;
  const evaluatedAnswers = userAnswers.map(userAnswer => {
      const question = questionFile.arrayQuestion.find(q => q._id.toString() === userAnswer.questionId);
      const isCorrect = question ? isAnswerCorrect(question, userAnswer) : false;
      if (isCorrect) correctAnswersCount++;

      return { ...userAnswer, isCorrect };
  });

  // Tính thời gian làm bài (nếu `startTime` được truyền từ frontend)
  const duration = startTime ? Math.round((Date.now() - new Date(startTime)) / 1000) : null;

  // Lưu kết quả bài làm
  const quizResultData = {
      creatBy: userId,
      quizId,
      correctAnswersCount,
      duration
  };

  return await quizRepository.saveQuizResult(quizResultData);
};

// Hàm kiểm tra đáp án đúng/sai (Cải tiến để hỗ trợ MAQ, MCQ, BOOLEAN)
function isAnswerCorrect(question, userAnswer) {
  const correctSet = new Set(question.correctAnswers.map(a => a.toString())); // Đáp án đúng
  const userSet = new Set(userAnswer.answers.map(a => a.toString())); // Đáp án người dùng

  return correctSet.size === userSet.size && [...correctSet].every(a => userSet.has(a));
};

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

