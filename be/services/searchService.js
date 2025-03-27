// services/SearchService.js
const mongoose = require('mongoose');
const QuestionFile = require('../models/QuestionFile');
const User = require('../models/Account');

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

class SearchService {
  async searchAll({ keyword }) {
    if (!keyword || typeof keyword !== 'string') {
      throw new Error('Invalid keyword');
    }

    const MIN_KEYWORD_LENGTH = 2;
    if (keyword.trim().length < MIN_KEYWORD_LENGTH) {
      throw new Error(`Từ khóa tìm kiếm phải có ít nhất ${MIN_KEYWORD_LENGTH} ký tự`);
    }

    try {
      const keywordNoAccents = removeAccents(keyword);
      const searchTerms = `${keyword} ${keywordNoAccents}`;

      const query = {
        $text: { $search: searchTerms },
        isLocked: false,
        isPrivate: false,
      };

      const userQuery = {
        $or: [
          { userName: { $regex: keyword, $options: 'i' } },
          { userNameNoAccents: { $regex: keywordNoAccents, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
        ],
        isLocked: false,
      };

      const questionFiles = await QuestionFile.find(query, { 
        name: 1, 
        arrayQuestion: 1, 
        createdBy: 1, 
        score: { $meta: "textScore" } 
      })
      .populate('createdBy', 'userName')
      .sort({ score: { $meta: "textScore" } })
      .lean();

      const users = await User.aggregate([
        {
          $match: userQuery
        },
        {
          $lookup: {
            from: 'questionfiles',
            localField: '_id',
            foreignField: 'createdBy',
            pipeline: [
              {
                $match: {
                  isLocked: false,
                  isPrivate: false
                }
              }
            ],
            as: 'questionFiles'
          }
        },
        {
          $addFields: {
            questionFileCount: { $size: '$questionFiles' }
          }
        },
        {
          $project: {
            userName: 1,
            avatar: 1,
            questionFileCount: 1,
            classCount: 1
          }
        }
      ]);

      return {
        success: true,
        totalResults: questionFiles.length + users.length,
        breakdown: { questionFiles: questionFiles.length, users: users.length },
        results: { questionFiles, users },
      };
    } catch (error) {
      console.error('Error in searchAll:', error.message, error.stack);
      throw new Error(error.message || 'Search failed');
    }
  }

  async searchQuestionFiles({ keyword, termCount, createdBy }) {
    if (!keyword || typeof keyword !== 'string') {
      throw new Error('Invalid keyword');
    }

    const MIN_KEYWORD_LENGTH = 2;
    if (keyword.trim().length < MIN_KEYWORD_LENGTH) {
      throw new Error(`Từ khóa tìm kiếm phải có ít nhất ${MIN_KEYWORD_LENGTH} ký tự`);
    }

    const keywordNoAccents = removeAccents(keyword);
    const searchTerms = `${keyword} ${keywordNoAccents}`;

    const query = {
      $text: { $search: searchTerms },
      isLocked: false,
      isPrivate: false,
    };

    if (termCount) {
      const [min, max] = termCount.split('-').map(Number);
      query['arrayQuestion.length'] = { $gte: min, $lte: max || Infinity };
    }
    if (createdBy) query.createdBy = createdBy;

    const questionFiles = await QuestionFile.find(query, { name: 1, arrayQuestion: 1, createdBy: 1 })
      .populate('createdBy', 'userName')
      .lean();

    return {
      success: true,
      questionFiles,
      total: questionFiles.length,
    };
  }

  async searchUsers({ keyword }) {
    if (!keyword || typeof keyword !== 'string') {
      throw new Error('Invalid keyword');
    }

    const MIN_KEYWORD_LENGTH = 2;
    if (keyword.trim().length < MIN_KEYWORD_LENGTH) {
      throw new Error(`Từ khóa tìm kiếm phải có ít nhất ${MIN_KEYWORD_LENGTH} ký tự`);
    }

    const keywordNoAccents = removeAccents(keyword);

    try {
        // Sử dụng aggregate để tính toán questionFileCount chính xác
        const users = await User.aggregate([
            {
                $match: {
                    $or: [
                        { userName: { $regex: keyword, $options: 'i' } },
                        { userNameNoAccents: { $regex: keywordNoAccents, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                    ],
                    isLocked: false,
                }
            },
            {
                $lookup: {
                    from: 'questionfiles',
                    localField: '_id',
                    foreignField: 'createdBy',
                    pipeline: [
                        {
                            $match: {
                                isLocked: false,
                                isPrivate: false
                            }
                        }
                    ],
                    as: 'questionFiles'
                }
            },
            {
                $addFields: {
                    questionFileCount: { $size: '$questionFiles' }
                }
            },
            {
                $project: {
                    userName: 1,
                    avatar: 1,
                    questionFileCount: 1,
                    classCount: 1
                }
            }
        ]);

        return {
            success: true,
            users,
            total: users.length,
        };
    } catch (error) {
        console.error('Error in searchUsers:', error);
        throw new Error(error.message || 'Search users failed');
    }
  }

  async searchUserById({ userId, searchKeyword }) {
    try {
        // Kiểm tra và tìm user
        const user = await User.findById(userId).select('userName avatar questionFileCount');
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        // Xây dựng query cho questionFiles
        const query = {
            createdBy: userId,
            isLocked: false
        };

        // Thêm điều kiện search nếu có searchKeyword
        if (searchKeyword && searchKeyword.trim().length >= 2) {
            const keywordNoAccents = removeAccents(searchKeyword);
            query.$or = [
                { name: { $regex: searchKeyword, $options: 'i' } },
                { nameNoAccents: { $regex: keywordNoAccents, $options: 'i' } },
                { description: { $regex: searchKeyword, $options: 'i' } }
            ];
        }

        // Lấy danh sách questionFiles
        const questionFiles = await QuestionFile.find(query)
            .select('name arrayQuestion createdAt')
            .sort({ createdAt: -1 })
            .lean();

        // Nhóm questionFiles theo tháng/năm
        const groupedQuestionFiles = questionFiles.reduce((acc, qf) => {
            const date = new Date(qf.createdAt);
            const monthYear = `${date.toLocaleString('vi-VN', { month: 'long' })} ${date.getFullYear()}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(qf);
            return acc;
        }, {});

        return {
            success: true,
            user: {
                userName: user.userName,
                avatar: user.avatar,
                totalQuestionFiles: user.questionFileCount || 0
            },
            questionFiles: groupedQuestionFiles
        };
    } catch (error) {
        console.error('Error in searchUserById:', error);
        throw error;
    }
  }
}

module.exports = new SearchService();