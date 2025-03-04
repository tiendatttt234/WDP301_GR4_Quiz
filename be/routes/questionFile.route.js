const express = require('express');
const QuestionFileRouter = express.Router();
const questionFileController = require('../controllers/questionFile.controller');

QuestionFileRouter.get('/getAll', questionFileController.getAllQuestionFile);
QuestionFileRouter.get('/getById/:id', questionFileController.getQuestionFileById);
QuestionFileRouter.post('/create', questionFileController.createQuestionFile);
QuestionFileRouter.put('/update/:id', questionFileController.updateQuestionFile);
QuestionFileRouter.delete('/delete/:id', questionFileController.deleteQuestionFile);
QuestionFileRouter.patch("/update/:fileId/question/:questionId", questionFileController.patchQuestion);
QuestionFileRouter.patch("/updatePrivacy/:fileId", questionFileController.updatePrivacy);
module.exports = QuestionFileRouter;

