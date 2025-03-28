const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const {QuestionFile} = require('../models');
const {questionFileService} = require('../services');

const exportQuestions = async (req, res) => {
    try {
        const { qfId, userId } = req.query;
        
        const questionFileReviced = await questionFileService.getQuestionFileByIdandUserId(qfId, userId);
        
        if (!questionFileReviced) {
            return res.status(404).json({ message: 'Không có dữ liệu để xuất' });
        }

        let content = `Chủ đề: ${questionFileReviced.name}\n`;
        content += `Mô tả: ${questionFileReviced.description}\n`;
        content += `Người tạo: ${questionFileReviced.createBy.userName}\n`;
        content += `Ngày tạo: ${new Date(questionFileReviced.createdAt).toLocaleString()}\n`;
        content += `Công khai: ${questionFileReviced.isPrivate ? 'Không' : 'Có'}\n\n`;
        content += 'Danh sách câu hỏi:\n';
        
        questionFileReviced.arrayQuestion.forEach((question, index) => {
            content += `${index + 1}. ${question.content} (${question.type})\n`;
            question.answers.forEach((answer, aIndex) => {
                content += `   ${String.fromCharCode(97 + aIndex)}. ${answer.answerContent} (${answer.isCorrect ? 'Đúng' : 'Sai'})\n`;
            });
            content += '\n';
        });

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="danh-sach-cau-hoi-${qfId}.txt"`);

        // Gửi nội dung trực tiếp về client để tải xuống
        return res.send(content);

    } catch (error) {
        console.error('Lỗi khi xuất file:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi xuất file' });
    }
};

const ExportController = { exportQuestions };
module.exports = ExportController;