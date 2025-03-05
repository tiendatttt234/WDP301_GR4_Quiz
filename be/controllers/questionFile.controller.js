// const QuestionFile = require("../models/QuestionFile");

const questionFileService = require('../services/questionFile.service');


  async function getAllQuestionFile(req, res, next) {
    try {
      

      const listQuestionFile = await questionFileService.getAllQuestionFiles();

      return res.status(200).json({ 
        success: true, 
        questionFileRespone: listQuestionFile 
      });
    } catch (error) {
      console.error("Error in getAllQuestionFile:", error);
      next(error);
    }
  }



  async function getQuestionFileById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Gọi service để lấy dữ liệu
      const questionFile = await questionFileService.getQuestionFileById(id);
  
      if (!questionFile) {
        return res.status(404).json({ message: "Question file not found or unauthorized access" });
      }
  
      return res.status(200).json({ questionFile });
    } catch (error) {
      next(error);
    }
  }


  async function createQuestionFile(req, res, next) {
    try {
      const newQuestionFile = await questionFileService.createQuestionFile(req.body);
      res.status(201).json({
        message: "Question File created successfully!",
        result: newQuestionFile,
      });
    } catch (error) {
      console.error("Error creating question file:", error);
      next(error);
    }
  }
  
  async function updateQuestionFile(req, res, next) {
    try {
      const { id } = req.params;
      const updatedQuestionFile = await questionFileService.updateQuestionFile(id, req.body);
  
      if (!updatedQuestionFile) {
        return res.status(404).json({ message: "Question file not found" });
      }
  
      res.status(200).json({ message: "Question file updated successfully", result: updatedQuestionFile });
    } catch (error) {
      console.error("Error updating question file:", error);
      next(error);
    }
  }
  
  async function deleteQuestionFile(req, res, next) {
    try {
      const { id } = req.params;
      const deletedQuestionFile = await questionFileService.deleteQuestionFile(id);
  
      if (!deletedQuestionFile) {
        return res.status(404).json({ message: "Question file not found" });
      }
  
      res.status(200).json({ message: "Question file deleted successfully", result: deletedQuestionFile });
    } catch (error) {
      console.error("Error deleting question file:", error);
      next(error);
    }
  }


  async function adminGetAllQF(req, res, next) {
    try {
      

      const listQuestionFile = await questionFileService.getAllQuestionFileAndUser();

      return res.status(200).json({ 
        success: true, 
        data: listQuestionFile 
      });
    } catch (error) {
      console.error("Error in getAllQuestionFile:", error);
      next(error);
    }
  }


const QuestionFileController = {
  getAllQuestionFile,
  getQuestionFileById,
  createQuestionFile,
  updateQuestionFile,
  deleteQuestionFile,
  adminGetAllQF
};

module.exports = QuestionFileController;
