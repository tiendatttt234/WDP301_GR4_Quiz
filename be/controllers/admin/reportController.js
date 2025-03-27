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

const lockOrDeleteQuestionFile = async (req, res) => {
    const { reportId } = req.params;
    const { action } = req.body; // 'lock' hoặc 'delete'

    try {
        // Tìm report
        const report = await Report.findById(reportId).populate("questionFile");
        console.log("Report found:", report);

        if (!report) {
            return res.status(404).json({ message: "Báo cáo không tồn tại" });
        }

        if (!report.questionFile) {
            return res.status(400).json({ message: "Không tìm thấy question file liên quan" });
        }

        // Chỉ xử lý nếu report chưa được approved (để tránh xử lý lại)
        if (report.status === "approved") {
            return res.status(400).json({ message: "Báo cáo đã được xử lý trước đó" });
        }

        let message = "";

        switch (action) {
            case 'lock':
                const lockedQuestionFile = await questionFile.findByIdAndUpdate(
                    report.questionFile._id,
                    { isLocked: true },
                    { new: true }
                );
                console.log("Locked QuestionFile:", lockedQuestionFile);

                if (!lockedQuestionFile) {
                    return res.status(404).json({ message: "Không tìm thấy question file để khóa" });
                }

                message = "Question file đã được khóa thành công";
                break;

            case 'delete':
                const deletedQuestionFile = await questionFile.findByIdAndDelete(report.questionFile._id);
                console.log("Deleted QuestionFile:", deletedQuestionFile);

                if (!deletedQuestionFile) {
                    return res.status(404).json({ message: "Không tìm thấy question file để xóa" });
                }

                message = "Question file đã được xóa thành công";
                break;

            default:
                return res.status(400).json({ message: "Hành động không hợp lệ. Chỉ chấp nhận 'lock' hoặc 'delete'" });
        }

        res.status(200).json({
            message,
            report: {
                _id: report._id,
                status: report.status,
                questionFileId: report.questionFile._id
            }
        });
    } catch (error) {
        console.error("Error in lockOrDeleteQuestionFile:", error);
        res.status(500).json({
            message: "Lỗi khi xử lý question file",
            error: error.message
        });
    }
};

module.exports = {
    getReportsList,
    getReportDetails,
    deleteReport,
    updateReportStatus,
    lockOrDeleteQuestionFile
};
