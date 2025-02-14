const express = require('express');
const QuizRouter = express.Router();
const {QuizController} = require('../controllers');

QuizRouter.get('/getAll', QuizController.getAllQuiz);
QuizRouter.get('/getByUser/:userId', QuizController.getQuizByUser);

module.exports = QuizRouter;