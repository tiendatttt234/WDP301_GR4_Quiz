const express = require('express');
const QuestionFileRouter = express.Router();
const questionFileController = require('../controllers/questionFile.controller');

QuestionFileRouter.get('/questionbank', questionFileController.getAllQuestionFile);
QuestionFileRouter.get('/questionbank/:id', questionFileController.getQuestionFileById);
QuestionFileRouter.post('/questionbank', QuestionFileController.createQuestionFile);
QuestionFileRouter.put('/questionbank/:id', QuestionFileController.updateQuestionFile);
QuestionFileRouter.delete('/questionbank/:id', QuestionFileController.deleteQuestionFile);

module.exports = QuestionFileRouter;
