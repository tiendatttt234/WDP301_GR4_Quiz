// controllers/exportController.js
const ExcelJS = require('exceljs');
// const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');
const {QuestionFile} = require('../models'); // Đường dẫn tới model của bạn
const {questionFileService} = require('../services');
// Hàm xuất file
const exportQuestions = async (req, res) => {
    try {
        const { format, qfId, userId } = req.query; // Lấy định dạng từ query params (excel, txt, docx)
        // console.log('format', format);
        // console.log('qfId', qfId);
        // console.log('userId', userId);
        
        // Lấy dữ liệu từ MongoDB
        const questionFileReviced = await questionFileService.getQuestionFileByIdandUserId(qfId, userId);

        // return res.status(200).json(questionFiles);
        // console.log(questionFiles);
        
        if (!questionFileReviced) {
            return res.status(404).json({ message: 'Không có dữ liệu để xuất' });
        }

        // Xử lý theo định dạng
        switch (format.toLowerCase()) {
            // case 'excel': {
            //     const workbook = new ExcelJS.Workbook();
            //     const worksheet = workbook.addWorksheet('Questions');

            //     // Define columns
            //     worksheet.columns = [
            //         { header: 'STT', key: 'index', width: 5 },
            //         { header: 'Tên chủ đề', key: 'name', width: 20 },
            //         { header: 'Mô tả', key: 'description', width: 30 },
            //         { header: 'Người tạo', key: 'createdBy', width: 15 },
            //         { header: 'Câu hỏi', key: 'question', width: 40 },
            //         { header: 'Loại', key: 'type', width: 10 },
            //         { header: 'Đáp án', key: 'answers', width: 50 },
            //         { header: 'Ngày tạo', key: 'createdAt', width: 20 }
            //     ];

            //     // Add rows
            //     questionFileReviced.arrayQuestion.forEach((question, index) => {
            //         const answersText = question.answers.map(a => 
            //             `${a.answerContent} (${a.isCorrect ? 'Đúng' : 'Sai'})`
            //         ).join('; ');
                    
            //         worksheet.addRow({
            //             index: index + 1,
            //             name: questionFileReviced.name,
            //             description: questionFileReviced.description,
            //             createdBy: questionFileReviced.createBy.userName,
            //             question: question.content,
            //             type: question.type,
            //             answers: answersText,
            //             createdAt: new Date(questionFileReviced.createdAt).toLocaleString()
            //         });
            //     });

                
            //     // Set headers and send file
            //     // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            //     // res.setHeader('Content-Disposition', 'attachment; filename=cac-cau-hoi-dia-ly.xlsx');
            //     // await workbook.xlsx.write(res);
            //     await workbook.xlsx.writeFile('uploads/cac-cau-hoi-dia-ly.xlsx');
            //     return res.end();
            // }

            case 'txt': {
                try {
                    let content = `Chủ đề: ${questionFileReviced.name}\n`;
                    content += `Mô tả: ${questionFileReviced.description}\n`;
                    content += `Người tạo: ${questionFileReviced.createBy.userName}\n`;
                    content += `Ngày tạo: ${new Date(questionFileReviced.createdAt).toLocaleString()}\n`;
                    content += `Công khai: ${questionFileReviced.isPrivate ? 'Không' : 'Có'}\n\n`;
                    content += 'Danh sách câu hỏi:\n';
                    content += '------------------------\n';
            
                    questionFileReviced.arrayQuestion.forEach((question, index) => {
                        content += `${index + 1}. ${question.content} (${question.type})\n`;
                        question.answers.forEach((answer, aIndex) => {
                            content += `   ${String.fromCharCode(97 + aIndex)}. ${answer.answerContent} (${answer.isCorrect ? 'Đúng' : 'Sai'})\n`;
                        });
                        content += '\n';
                    });
            
                    // Xác định đường dẫn lưu file trong thư mục uploads
                    const uploadDir = path.join(__dirname, '../uploads');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
                    }
            
                    const filePath = path.join(uploadDir, `danh-sach-cau-hoi.txt`);
            
                    // Ghi nội dung vào file txt
                    fs.writeFileSync(filePath, content, 'utf8');
            
                    // Trả về đường dẫn file đã lưu
                    return res.json({ filePath: `/uploads/danh-sach-cau-hoi.txt` });
                } catch (error) {
                    console.error('Lỗi khi lưu file TXT:', error);
                    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu file TXT.' });
                }
            }

            default:
                return res.status(400).json({ message: 'Định dạng không hợp lệ. Chọn excel, txt.' });
        }
    } catch (error) {
        console.error('Lỗi khi xuất file:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi xuất file' });
    }
};
const ExportController = { exportQuestions };
module.exports = ExportController;