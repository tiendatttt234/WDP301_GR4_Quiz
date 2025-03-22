const express = require('express');
const QuestionFileRouter = express.Router();
const questionFileController = require('../controllers/questionFile.controller');
const multer = require("multer");
const { verifyAccessToken } = require("../middlewares/jwt_helper"); // Import verifyAccessToken
const upload = multer({ dest: "uploads/" });

QuestionFileRouter.get("/getAll", questionFileController.getAllQuestionFile);
QuestionFileRouter.get("/getById/:id", questionFileController.getQuestionFileById);
QuestionFileRouter.post("/create", verifyAccessToken, questionFileController.createQuestionFile); //
QuestionFileRouter.put("/update/:id", verifyAccessToken, questionFileController.updateQuestionFile); //
QuestionFileRouter.delete("/delete/:id", verifyAccessToken, questionFileController.deleteQuestionFile); //
QuestionFileRouter.patch("/update/:fileId/question/:questionId", verifyAccessToken, questionFileController.patchQuestion); //
QuestionFileRouter.patch("/updatePrivacy/:fileId", verifyAccessToken, questionFileController.updatePrivacy); //
QuestionFileRouter.post("/import", verifyAccessToken, upload.single("file"), questionFileController.importQuestionFile); //
QuestionFileRouter.get("/getQFadmin", verifyAccessToken, questionFileController.adminGetAllQF); //
QuestionFileRouter.get("/getAll/:userId", verifyAccessToken, questionFileController.getQuestionFilesByUserId); //

module.exports = QuestionFileRouter;

