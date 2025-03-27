// controllers/SearchController.js
const SearchService = require('../services/SearchService');
const Joi = require('joi');
const mongoose = require('mongoose');

const searchSchema = Joi.object({
  keyword: Joi.string().required(),
  termCount: Joi.string().pattern(/^\d+-\d*$/).optional(),
  createdBy: Joi.string().optional(),
});

class SearchController {
  async searchAll(req, res) {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        return res.status(400).json({ success: false, message: 'Keyword is required' });
      }

      const result = await SearchService.searchAll({ keyword });
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in SearchController.searchAll:', error.message, error.stack);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async searchQuestionFiles(req, res) {
    const start = Date.now();
    try {
      const { error, value } = searchSchema.validate(req.query);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      const result = await SearchService.searchQuestionFiles(value);
      console.log(`GET /search/question-files?keyword=${value.keyword} took ${Date.now() - start} ms`);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Error in searchQuestionFiles [${Date.now() - start}ms]:`, error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async searchUsers(req, res) {
    const start = Date.now();
    try {
      const { error, value } = searchSchema.validate(req.query);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });

      const result = await SearchService.searchUsers(value);
      console.log(`GET /search/users?keyword=${value.keyword} took ${Date.now() - start} ms`);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Error in searchUsers [${Date.now() - start}ms]:`, error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async searchUserById(req, res) {
    const start = Date.now();
    try {
      const { userId } = req.params;
      const { searchKeyword } = req.query;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID người dùng không hợp lệ'
        });
      }

      const result = await SearchService.searchUserById({ userId, searchKeyword });
      
      if (!result.user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      console.log(`GET /search/users/${userId} took ${Date.now() - start} ms`);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Error in searchUserById [${Date.now() - start}ms]:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi server khi tìm kiếm người dùng'
      });
    }
  }
}

module.exports = new SearchController();