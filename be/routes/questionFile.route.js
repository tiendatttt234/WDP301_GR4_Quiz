const express = require('express');
const QuestionFileRouter = express.Router();
const questionFileController = require('../controllers/questionFile.controller');

QuestionFileRouter.get('/questionbank', questionFileController.getAllQuestionFile);
QuestionFileRouter.get('/questionbank/:id', questionFileController.getQuestionFileById);
QuestionFileRouter.post('/questionbank', questionFileController.createQuestionFile);
QuestionFileRouter.put('/questionbank/:id', questionFileController.updateQuestionFile);
QuestionFileRouter.delete('/questionbank/:id', questionFileController.deleteQuestionFile);

module.exports = QuestionFileRouter;
