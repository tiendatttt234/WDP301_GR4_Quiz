import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showHandlePopup, setShowHandlePopup] = useState(false);
    const [handleMessage, setHandleMessage] = useState("");
    const [handleStatus, setHandleStatus] = useState("");
    const [actionType, setActionType] = useState("");
    const reportsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get("http://localhost:9999/admin/reports");
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            setError("Lỗi khi lấy dữ liệu báo cáo");
            setLoading(false);
        }
    };

    const viewReportDetails = async (reportId) => {
        try {
            const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`);
            setSelectedReport(response.data);
        } catch (error) {
            alert("Lỗi khi lấy chi tiết báo cáo");
        }
    };

    const viewQuestionFileReported = async (reportId) => {
        try {
            const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`);
            const questionFileReported = response.data.questionFile;
            const questionFileId = questionFileReported.qf_id;
            navigate(`/admin/view-question-detail/${questionFileId}`);
        } catch (error) {
            alert("Lỗi khi lấy dữ liệu bộ câu hỏi bị báo cáo");
        }
    };

    const handleReport = async (reportId) => {
        try {
            const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`);
            setSelectedReport(response.data);
            setShowHandlePopup(true);
            setActionType("");
            setHandleMessage("");
            setHandleStatus(response.data.status);
        } catch (error) {
            alert("Lỗi khi lấy chi tiết báo cáo để xử lý");
        }
    };

    const submitHandleReport = async () => {
        // Thêm xác nhận bằng window.confirm
        const confirmMessage = handleStatus === "approved"
            ? `Bạn có chắc chắn muốn ${actionType} bộ câu hỏi và gửi thông báo cho người vi phạm không?`
            : "Bạn có chắc chắn muốn từ chối báo cáo này không?";
        
        if (!window.confirm(confirmMessage)) {
            return; // Nếu người dùng chọn "Cancel", thoát hàm
        }

        try {
            if (handleStatus === "approved") {
                if (!actionType) {
                    alert("Vui lòng chọn hành động (Lock hoặc Delete)");
                    return;
                }
                if (!handleMessage.trim()) {
                    alert("Vui lòng nhập thông báo cho người vi phạm");
                    return;
                }

                // Xử lý lock hoặc delete question file
                await axios.put(`http://localhost:9999/admin/reports/${selectedReport.report_id}/action`, {
                    action: actionType.toLowerCase(),
                });

                // Gửi thông báo tới người vi phạm
                await axios.post("http://localhost:9999/notifycation/notify", {
                    recipientId: selectedReport.questionFile.qf_createdById,
                    type: "Warning",
                    message: `Bộ câu hỏi "${selectedReport.questionFile.qf_name}" của bạn đã bị ${actionType === "lock" ? "khóa" : "xóa"}. Lý do: ${handleMessage}`,
                });
            }

            // Cập nhật trạng thái report (approved hoặc rejected)
            await axios.put(`http://localhost:9999/admin/reports/${selectedReport.report_id}/status`, {
                status: handleStatus,
            });

            // Cập nhật danh sách reports
            await fetchReports();

            setShowHandlePopup(false);
            setHandleMessage("");
            setHandleStatus("approved");
            setActionType("");
            setSelectedReport(null);
            alert(`Đã xử lý báo cáo thành công với trạng thái ${handleStatus}`);
        } catch (error) {
            alert("Lỗi khi xử lý báo cáo: " + error.message);
        }
    };

    const closeModal = () => {
        setSelectedReport(null);
        setShowHandlePopup(false);
        setHandleMessage("");
        setHandleStatus("approved");
        setActionType("");
    };

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="reports-container">
            <h1>Báo cáo</h1>
            <table className="reports-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Người gửi</th>
                        <th>Bộ câu hỏi</th>
                        <th>Lý do</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentReports.map((report, index) => (
                        <tr key={report._id}>
                            <td>{indexOfFirstReport + index + 1}</td>
                            <td>{report.sender}</td>
                            <td>{report.quizName}</td>
                            <td>{report.reason}</td>
                            <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td>
                                <span className={`status ${report.status.toLowerCase()}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="action-btn view"
                                    onClick={() => viewReportDetails(report._id)}
                                >
                                    View
                                </button>
                                <button
                                    className="action-btn view"
                                    onClick={() => viewQuestionFileReported(report._id)}
                                >
                                    File Detail
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleReport(report._id)}
                                    disabled={report.status === "approved" || report.status === "rejected"}
                                >
                                    Handle
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: Math.ceil(reports.length / reportsPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {selectedReport && !showHandlePopup && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>×</span>
                        <h2>Chi tiết báo cáo</h2>
                        <p><strong>Người gửi:</strong> {selectedReport.sender}</p>
                        <p>
                            <strong>Bộ Câu hỏi:</strong>{" "}
                            {selectedReport.questionFile?.qf_name || "Không có dữ liệu"}
                        </p>
                        <p>
                            <strong>Người tạo Quiz:</strong>{" "}
                            {selectedReport.questionFile?.qf_createdBy || "Không có dữ liệu"}
                        </p>
                        <p><strong>Lý do:</strong> {selectedReport.reason}</p>
                        <p>
                            <strong>Trạng thái:</strong>
                            <span className={`status ${selectedReport.status.toLowerCase()}`}>
                                {selectedReport.status}
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {showHandlePopup && selectedReport && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>×</span>
                        <h2>Xử lý báo cáo</h2>
                        <p><strong>Bộ câu hỏi:</strong> {selectedReport.questionFile?.qf_name}</p>
                        <p><strong>Lý do:</strong> {selectedReport.reason}</p>

                        <div className="form-group">
                            <label htmlFor="handleStatus">Trạng thái:</label>
                            <select
                                id="handleStatus"
                                value={handleStatus}
                                onChange={(e) => setHandleStatus(e.target.value)}
                            >
                                <option value="">Chọn hành động</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {handleStatus === "approved" && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="actionType">Hành động:</label>
                                    <select
                                        id="actionType"
                                        value={actionType}
                                        onChange={(e) => setActionType(e.target.value)}
                                    >
                                        <option value="">Chọn hành động</option>
                                        <option value="lock">Lock</option>
                                        <option value="delete">Delete</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="handleMessage">Thông báo tới người vi phạm:</label>
                                    <textarea
                                        id="handleMessage"
                                        value={handleMessage}
                                        onChange={(e) => setHandleMessage(e.target.value)}
                                        placeholder="Nhập thông báo xử lý..."
                                        rows="4"
                                    />
                                </div>
                            </>
                        )}

                        <div className="modal-actions">
                            <button className="action-btn submit" onClick={submitHandleReport}>
                                Gửi và Cập nhật
                            </button>
                            <button className="action-btn cancel" onClick={closeModal}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;