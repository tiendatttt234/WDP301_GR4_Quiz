const express = require("express");
const QuestionFileRouter = express.Router();
const questionFileController = require("../controllers/questionFile.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

QuestionFileRouter.get("/getAll", questionFileController.getAllQuestionFile);
QuestionFileRouter.get(
  "/getById/:id",
  questionFileController.getQuestionFileById
);
QuestionFileRouter.post("/create", questionFileController.createQuestionFile);
QuestionFileRouter.put(
  "/update/:id",
  questionFileController.updateQuestionFile
);
QuestionFileRouter.delete(
  "/delete/:id",
  questionFileController.deleteQuestionFile
);
QuestionFileRouter.patch(
  "/update/:fileId/question/:questionId",
  questionFileController.patchQuestion
);
QuestionFileRouter.patch(
  "/updatePrivacy/:fileId",
  questionFileController.updatePrivacy
);
QuestionFileRouter.post(
  "/import",
  upload.single("file"),
  questionFileController.importQuestionFile
);
QuestionFileRouter.get("/getQFadmin", questionFileController.adminGetAllQF);
QuestionFileRouter.get(
  "/getAll/:userId",
  questionFileController.getQuestionFilesByUserId
);
QuestionFileRouter.get("/user/:userId", questionFileController.findAllByUser);

module.exports = QuestionFileRouter;
