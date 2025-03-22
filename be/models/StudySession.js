const mongoose = require("mongoose");

const StudySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  questionFileId: {
    type: mongoose.Schema.ObjectId,
    ref: "QuestionFile",
    required: true,
  },
  questions: [{
    questionId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    answers: [{
      answerContent: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }],
    correctAnswers: [{ type: String, required: true }],
    wrongAttempts: { type: Number, default: 0 },
    isLearned: { type: Boolean, default: false }
  }],
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  currentRound: {
    type: Number,
    default: 1
  },
  roundSummaries: [{
    roundNumber: { type: Number, required: true },
    questions: [{
      content: { type: String, required: true },
      correctAnswers: [{ type: String, required: true }],
      wrongAttempts: { type: Number },
      isLearned: { type: Boolean }
    }],
    correctCount: { type: Number, required: true },
    totalInRound: { type: Number, required: true }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

StudySessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const StudySession = mongoose.model("StudySession", StudySessionSchema);
module.exports = StudySession;