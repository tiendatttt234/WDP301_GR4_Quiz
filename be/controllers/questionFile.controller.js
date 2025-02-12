// const QuestionFile = require("../models/QuestionFile");

const questionFileService = require('../services/questionFile.service');


  async function getAllQuestionFile(req, res, next) {
    try {
      const userId = req.query.userId;

      if (!userId) {
        return res.status(400).json({ success: false, message: "userId is required" });
      }

      const listQuestionFile = await questionFileService.getAllQuestionFiles(userId);

      return res.status(200).json({ 
        success: true, 
        questionFileRespone: listQuestionFile 
      });
    } catch (error) {
      console.error("Error in getAllQuestionFile:", error);
      next(error);
    }
  }





// async function getQuestionFileById(req, res, next) {
//   try {
//     const { id } = req.params;
    


//     // Tìm questionFile theo id và userId
//     const questionFile = await QuestionFile.findOne({
//       _id: id,
      
//     });
//     if (!questionFile) {
//       return res.status(404).json({ message: "Question file not found or unauthorized access" });
//     }

//     // Định dạng dữ liệu trả về
//     const formattedResult = {
//       name: questionFile.name,
//       description: questionFile.description,
//       isPrivate: questionFile.isPrivate,
//       arrayQuestion: questionFile.arrayQuestion.map((question) => ({
//         questionId: question._id,
//         content: question.content,
//         type: question.type,
//         answers: question.answers.map((answer) => ({
//           answerId: answer._id,
//           answerContent: answer.answerContent,
//           isCorrect: answer.isCorrect,
//         })),
//       })),
//     };

//     return res.status(200).json({ questionFile: formattedResult });
//   } catch (error) {
//     next(error);
//   }
// }
// async function createQuestionFile(req, res, next) {
//   try {
//     const newQuestionFile = await QuestionFile.create(req.body);
//     res.status(201).json({
//       message: "Question File created successfully!",
//       result: newQuestionFile,
//     });
//   } catch (error) {
//     console.error("Error creating question file:", error);
//     res.status(500).json({ message: error.message });
//   }
// }
// async function updateQuestionFile(req, res, next) {
//   try {
//     const { id } = req.params;

//     // Cập nhật questionFile theo ID
//     const updatedQuestionFile = await QuestionFile.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true }
//     );

//     if (!updatedQuestionFile) {
//       return res.status(404).json({ message: "Question file not found" });
//     }

//     res.status(200).json({ mesgae: "Question file updated successfully" });
//   } catch (error) {
//     console.error("Error updating question file:", error);
//     res.status(500).json({ message: error.message });
//   }
// }

// async function deleteQuestionFile(req, res, next) {
//   try {
//     const { id } = req.params;
//     const deletedQuestionFile = await QuestionFile.findByIdAndDelete(id);
//     res.status(200).json({ deletedQuestionFile });
//   } catch (error) {
//     console.error("Error deleting question file:", error);
//     res.status(500).json({ message: error.message });
//   }
// }

const QuestionFileController = {
  getAllQuestionFile,
  getQuestionFileById,
  createQuestionFile,
  updateQuestionFile,
  deleteQuestionFile,
};

module.exports = QuestionFileController;
