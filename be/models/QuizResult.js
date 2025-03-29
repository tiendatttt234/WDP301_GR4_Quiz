const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    correctAnswersCount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const QuizResult = mongoose.model('QuizResult', QuizResultSchema);
module.exports = QuizResult;
