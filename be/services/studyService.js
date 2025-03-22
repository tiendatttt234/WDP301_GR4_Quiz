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

    session.correctAnswers = session.questions.filter(q => q.isLearned).length;
    await session.save();

    const learnedCount = session.questions.filter(q => q.isLearned).length;
    const progress = {
      learnedCount,
      totalQuestions: session.totalQuestions,
      percentage: Math.round((learnedCount / session.totalQuestions) * 100),
    };

    console.log("getStudySession response:", {
      questions: session.questions,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      currentRound: session.currentRound,
      progress,
      completed: learnedCount === session.totalQuestions,
    });

    return {
      questions: session.questions, // Trả về tất cả câu hỏi
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      currentRound: session.currentRound,
      progress,
      completed: learnedCount === session.totalQuestions,
    };
  }

  async submitAnswer(userId, questionFileId, questionId, selectedAnswers) {
    const session = await StudySession.findOne({ userId, questionFileId });
    if (!session) {
      throw new Error("Study session not found");
    }

    const question = session.questions.find(q => q.questionId === questionId);
    if (!question) {
      throw new Error("Question not found in study session");
    }

    const isCorrect = this.checkAnswer(question, selectedAnswers);

    if (!isCorrect) {
      question.wrongAttempts += 1;
    }

    if (!question.isLearned && isCorrect) {
      question.isLearned = true;
      session.correctAnswers = session.questions.filter(q => q.isLearned).length;
    }

    await session.save();

    const learnedCount = session.questions.filter(q => q.isLearned).length;
    const progress = {
      learnedCount,
      totalQuestions: session.totalQuestions,
      percentage: Math.round((learnedCount / session.totalQuestions) * 100),
    };

    console.log("submitAnswer response:", { isCorrect, progress, correctAnswers: question.correctAnswers });

    if (!isCorrect) {
      return { isCorrect: false, correctAnswers: question.correctAnswers, progress };
    }

    return { isCorrect: true, progress };
  }

  async endRound(userId, questionFileId) {
    const session = await StudySession.findOne({ userId, questionFileId });
    if (!session) {
      throw new Error("Study session not found");
    }

    const roundSummary = {
      roundNumber: session.currentRound,
      questions: session.questions.map(q => ({
        content: q.content,
        correctAnswers: q.correctAnswers,
        wrongAttempts: q.wrongAttempts,
        isLearned: q.isLearned,
      })),
      correctCount: session.questions.filter(q => q.isLearned).length,
      totalInRound: session.questions.length,
    };

    session.roundSummaries.push(roundSummary);

    const learnedCount = session.questions.filter(q => q.isLearned).length;
    console.log("Questions in session:", session.questions.map(q => ({ questionId: q.questionId, isLearned: q.isLearned })));
    console.log("Learned count:", learnedCount);
    const progress = {
      learnedCount,
      totalQuestions: session.totalQuestions,
      percentage: Math.round((learnedCount / session.totalQuestions) * 100),
    };

    const allQuestionsCompleted = session.questions.every(q => q.isLearned);
    console.log("All questions completed:", allQuestionsCompleted);
    if (allQuestionsCompleted) {
      await StudySession.deleteOne({ userId, questionFileId });
    }

    return {
      roundSummary,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      progress,
      allQuestionsCompleted,
    };
  }

  checkAnswer(question, selectedAnswers) {
    const correctSet = new Set(question.correctAnswers);
    return selectedAnswers.length === correctSet.size && selectedAnswers.every(a => correctSet.has(a));
  }
}

module.exports = new StudyService();