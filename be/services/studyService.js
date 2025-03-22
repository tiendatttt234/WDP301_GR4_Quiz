const StudySession = require("../models/StudySession");
const QuestionFile = require("../models/QuestionFile");

class StudyService {
  
  async getStudySession(userId, questionFileId, reset = false) {
    if (reset) {
      await StudySession.deleteOne({ userId, questionFileId });
    }
  
    let session = await StudySession.findOne({ userId, questionFileId });
    const questionFile = await QuestionFile.findById(questionFileId);
    if (!questionFile) {
      throw new Error("Question file not found");
    }
  
    if (!session || reset) {
      if (!questionFile.arrayQuestion || questionFile.arrayQuestion.length === 0) {
        throw new Error("Question file has no questions");
      }
  
      const uniqueQuestions = Array.from(
        new Map(questionFile.arrayQuestion.map(q => [q.content, q])).values()
      );
  
      session = new StudySession({
        userId,
        questionFileId,
        questions: uniqueQuestions.map((q) => ({
          questionId: q._id.toString(),
          content: q.content,
          type: q.type,
          answers: q.answers,
          correctAnswers: q.answers.filter(a => a.isCorrect).map(a => a.answerContent),
          wrongAttempts: 0,
          isLearned: false,
        })),
        correctAnswers: 0,
        totalQuestions: uniqueQuestions.length,
        currentRound: 1,
        roundSummaries: [],
      });
      await session.save();
    }
  
    const QUESTIONS_PER_ROUND = 7;
    const totalRounds = Math.ceil(session.totalQuestions / QUESTIONS_PER_ROUND);
    const startIndex = (session.currentRound - 1) * QUESTIONS_PER_ROUND;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_ROUND, session.totalQuestions);
    const roundQuestions = session.questions.slice(startIndex, endIndex);
  
    const learnedCount = session.questions.filter(q => q.isLearned).length;
    const progress = {
      learnedCount,
      totalQuestions: session.totalQuestions,
      percentage: Math.round((learnedCount / session.totalQuestions) * 100),
    };
  
    return {
      questions: roundQuestions,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      currentRound: session.currentRound,
      totalRounds,
      progress,
      completed: session.currentRound > totalRounds,
      questionFileName: questionFile.name, // Thêm tên questionFile
    };
  }
  async submitAnswer(userId, questionFileId, questionId, selectedAnswers) {
    const session = await StudySession.findOne({ userId, questionFileId });
    if (!session) {
      throw new Error("Study session not found");
    }

    const question = session.questions.find(q => q.questionId === questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    const isCorrect = selectedAnswers.every(answer => question.correctAnswers.includes(answer)) &&
                     question.correctAnswers.every(answer => selectedAnswers.includes(answer));

    if (!isCorrect) {
      question.wrongAttempts += 1;
    } else {
      question.isLearned = true;
    }

    session.correctAnswers = session.questions.filter(q => q.isLearned).length;
    await session.save();

    const learnedCount = session.questions.filter(q => q.isLearned).length;
    const progress = {
      learnedCount,
      totalQuestions: session.totalQuestions,
      percentage: Math.round((learnedCount / session.totalQuestions) * 100),
    };

    return { isCorrect, correctAnswers: question.correctAnswers, progress };
  }

  async endRound(userId, questionFileId) {
    const session = await StudySession.findOne({ userId, questionFileId });
    if (!session) {
      throw new Error("Study session not found");
    }
  
    const QUESTIONS_PER_ROUND = 7;
    const startIndex = (session.currentRound - 1) * QUESTIONS_PER_ROUND;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_ROUND, session.totalQuestions);
    const roundQuestions = session.questions.slice(startIndex, endIndex);
  
    const roundSummary = {
      roundNumber: session.currentRound,
      questions: roundQuestions.map(q => ({
        content: q.content,
        correctAnswers: q.correctAnswers,
        wrongAttempts: q.wrongAttempts,
        isLearned: q.isLearned,
      })),
      correctCount: roundQuestions.filter(q => q.isLearned).length,
      totalInRound: roundQuestions.length,
    };
  
    session.roundSummaries.push(roundSummary);
    const totalRounds = Math.ceil(session.totalQuestions / QUESTIONS_PER_ROUND);
  
    const learnedCount = session.questions.filter(q => q.isLearned).length;
    const progress = {
      learnedCount,
      totalQuestions: session.totalQuestions,
      percentage: Math.round((learnedCount / session.totalQuestions) * 100),
    };
  
    // Chỉ tăng currentRound nếu chưa hết lượt
    const allRoundsCompleted = session.currentRound >= totalRounds;
    if (!allRoundsCompleted) {
      session.currentRound += 1;
    }
  
    await session.save();
  
    return {
      roundSummary, // Kết quả của lượt vừa học
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      currentRound: session.currentRound,
      totalRounds,
      progress,
      allRoundsCompleted, // Báo hiệu đã học hết các lượt
    };
  }
  async resetStudySession(userId, questionFileId) {
    await StudySession.deleteOne({ userId, questionFileId });
    return this.getStudySession(userId, questionFileId, true);
  }
}

module.exports = new StudyService();