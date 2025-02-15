const express = require('express');
const QuestionFileRouter = express.Router();
const questionFileController = require('../controllers/questionFile.controller');

QuestionFileRouter.get('/questionbank', questionFileController.getAllQuestionFile);
QuestionFileRouter.get('/questionbank/:id', questionFileController.getQuestionFileById);

module.exports = QuestionFileRouter;
