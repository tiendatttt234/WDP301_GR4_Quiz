const express = require('express');
const QuestionFileRouter = express.Router();
const questionFileController = require('../controllers/questionFile.controller');

router.get('/questionbank', questionFileController.getAllQuestionFile);

module.exports = QuestionFileRouter;
