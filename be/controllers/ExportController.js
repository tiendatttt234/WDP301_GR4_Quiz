// controllers/exportController.js
// const ExcelJS = require('exceljs');
// const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const {QuestionFile} = require('../models'); // Đường dẫn tới model của bạn
const {questionFileService} = require('../services');
// Hàm xuất file
const exportQuestions = async (req, res) => {
    try {
        const { format, qfId, userId } = req.query; // Lấy định dạng từ query params (excel, txt, docx)
        console.log('format', format);
        console.log('qfId', qfId);
        console.log('userId', userId);
        
        // Lấy dữ liệu từ MongoDB
        const questionFiles = await questionFileService.getQuestionFileByIdandUserId(qfId, userId);

        return res.status(200).json(questionFiles);
        if (!questionFiles.length) {
            return res.status(404).json({ message: 'Không có dữ liệu để xuất' });
        }

        // Xử lý theo định dạng
        switch (format.toLowerCase()) {
            case 'excel': {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Questions');

                worksheet.columns = [
                    { header: 'Name', key: 'name', width: 20 },
                    { header: 'Description', key: 'description', width: 30 },
                    { header: 'Created By', key: 'createdBy', width: 20 },
                    { header: 'Questions', key: 'questions', width: 50 },
                    { header: 'Reported Count', key: 'reportedCount', width: 15 },
                    { header: 'Private', key: 'isPrivate', width: 10 }
                ];

                questionFiles.forEach(file => {
                    worksheet.addRow({
                        name: file.name,
                        description: file.description || 'N/A',
                        createdBy: file.createdBy ? file.createdBy.username : 'Unknown',
                        questions: file.arrayQuestion.map(q => q.content).join('; '),
                        reportedCount: file.reportedCount,
                        isPrivate: file.isPrivate ? 'Yes' : 'No'
                    });
                });

                // Gửi file về client
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=questions.xlsx');
                await workbook.xlsx.write(res);
                return res.end();
            }

            case 'txt': {
                let content = '';
                questionFiles.forEach(file => {
                    content += `Name: ${file.name}\n`;
                    content += `Description: ${file.description || 'N/A'}\n`;
                    content += `Created By: ${file.createdBy ? file.createdBy.username : 'Unknown'}\n`;
                    content += `Questions:\n`;
                    file.arrayQuestion.forEach((q, index) => {
                        content += `  ${index + 1}. ${q.content} (${q.type})\n`;
                        q.answers.forEach((a, aIndex) => {
                            content += `     - ${a.answerContent} (${a.isCorrect ? 'Correct' : 'Incorrect'})\n`;
                        });
                    });
                    content += `Reported Count: ${file.reportedCount}\n`;
                    content += `Private: ${file.isPrivate ? 'Yes' : 'No'}\n`;
                    content += '------------------------\n';
                });

                // Gửi file về client
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', `attachment; filename=questions.txt`);
                return res.send(content);
            }

            // case 'docx': {
            //     const doc = new Document({
            //         sections: [{
            //             properties: {},
            //             children: questionFiles.map(file => [
            //                 new Paragraph({
            //                     children: [new TextRun({ text: `Name: ${file.name}`, bold: true })]
            //                 }),
            //                 new Paragraph({
            //                     children: [new TextRun(`Description: ${file.description || 'N/A'}`)]
            //                 }),
            //                 new Paragraph({
            //                     children: [new TextRun(`Created By: ${file.createdBy ? file.createdBy.username : 'Unknown'}`)]
            //                 }),
            //                 new Paragraph({
            //                     children: [new TextRun('Questions:')]
            //                 }),
            //                 ...file.arrayQuestion.map((q, index) => [
            //                     new Paragraph({
            //                         children: [new TextRun(`  ${index + 1}. ${q.content} (${q.type})`)]
            //                     }),
            //                     ...q.answers.map(a => new Paragraph({
            //                         children: [new TextRun(`     - ${a.answerContent} (${a.isCorrect ? 'Correct' : 'Incorrect'})`)]
            //                     }))
            //                 ]).flat(),
            //                 new Paragraph({
            //                     children: [new TextRun(`Reported Count: ${file.reportedCount}`)]
            //                 }),
            //                 new Paragraph({
            //                     children: [new TextRun(`Private: ${file.isPrivate ? 'Yes' : 'No'}`)]
            //                 }),
            //                 new Paragraph({ children: [new TextRun('------------------------')] })
            //             ]).flat()
            //         }]
            //     });

            //     const buffer = await Packer.toBuffer(doc);
            //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            //     res.setHeader('Content-Disposition', 'attachment; filename=questions.docx');
            //     return res.send(buffer);
            // }

            default:
                return res.status(400).json({ message: 'Định dạng không hợp lệ. Chọn excel, txt hoặc docx.' });
        }
    } catch (error) {
        console.error('Lỗi khi xuất file:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi xuất file' });
    }
};
const ExportController = { exportQuestions };
module.exports = ExportController;