const Report = require("../../models/Report");
const questionFile = require("../../models/QuestionFile");
// Lấy danh sách báo cáo
const getReportsList = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("reportBy", "userName") 
            .populate("questionFile", "name"); 

        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: "Không có báo cáo nào" });
        }

        const response = reports.map(report => ({
            _id: report._id,
            sender: report.reportBy.userName,
            quizName: report.questionFile ? report.questionFile.name : "Không xác định", 
            reason: report.reason,
            createdAt: report.createdAt,
            status: report.status
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách báo cáo", error: error.message });
    }
};


const getReportDetails = async (req, res) => {
    const { reportId } = req.params;
    console.log(reportId);
    
    try {
        const report = await Report.findById(reportId)
            .populate("reportBy", "userName")
            .populate({
                path: "questionFile",
                select: "name createdBy _id",
                populate: { path: "createdBy", select: ["userName","_id" ]}
            });

        if (!report) {
            return res.status(404).json({ message: "Báo cáo không tồn tại" });
        }

        res.status(200).json({
            report_id: report._id,
            sender: report.reportBy.userName,
            senderId: report.reportBy._id,
            questionFile: {
                qf_id: report.questionFile._id,
                qf_name: report.questionFile.name,
                qf_createdBy: report.questionFile.createdBy.userName,
                qf_createdById: report.questionFile.createdBy._id
            },
            reason: report.reason,
            status: report.status
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết báo cáo", error: error.message });
    }
};

// Xóa báo cáo
const deleteReport = async (req, res) => {
    const { reportId } = req.params;

    try {
        const report = await Report.findByIdAndDelete(reportId);

        if (!report) {
            return res.status(404).json({ message: "Báo cáo không tồn tại" });
        }

        res.status(200).json({ message: "Báo cáo đã được xóa" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa báo cáo", error: error.message });
    }
};

const updateReportStatus = async (req, res) => {
    const { reportId } = req.params;
    const { status } = req.body;

    try {
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        const report = await Report.findByIdAndUpdate(
            reportId,
            { status },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: "Báo cáo không tồn tại" });
        }

        res.status(200).json({ 
            message: "Cập nhật trạng thái báo cáo thành công",
            report 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái báo cáo", error: error.message });
    }
};

module.exports = {
    getReportsList,
    getReportDetails,
    deleteReport,
    updateReportStatus
};
