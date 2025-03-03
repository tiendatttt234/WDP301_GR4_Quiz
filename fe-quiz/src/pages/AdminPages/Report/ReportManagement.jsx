import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 10;
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    // Lấy danh sách báo cáo
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

    // Xóa báo cáo
    const deleteReport = async (reportId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) return;
        try {
            await axios.delete(`http://localhost:9999/admin/reports/${reportId}`);
            setReports(reports.filter(report => report._id !== reportId));
            alert("Báo cáo đã được xóa thành công");
        } catch (error) {
            alert("Lỗi khi xóa báo cáo");
        }
    };

    // Lấy chi tiết báo cáo khi nhấn "View"
    const viewReportDetails = async (reportId) => {
        try {
            const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`);
            setSelectedReport(response.data);
        } catch (error) {
            alert("Lỗi khi lấy chi tiết báo cáo");
        }
    };

    // Đóng modal
    const closeModal = () => {
        setSelectedReport(null);
    };

    // Tính toán danh sách báo cáo hiển thị theo trang
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
                                <button className="action-btn view" onClick={() => viewReportDetails(report._id)}>
                                    View
                                </button>
                                <button className="action-btn delete" onClick={() => deleteReport(report._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
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

            {selectedReport && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Chi tiết báo cáo</h2>
                        <p><strong>Người gửi:</strong> {selectedReport.sender}</p>
                        <p><strong>Bộ Câu hỏi:</strong> {selectedReport.questionFile?.name || "Không có dữ liệu"}</p>
                        <p><strong>Người tạo Quiz:</strong> {selectedReport.questionFile?.createdBy || "Không có dữ liệu"}</p>
                        <p><strong>Lý do:</strong> {selectedReport.reason}</p>
                        <p><strong>Trạng thái:</strong>
                            <span className={`status ${selectedReport.status.toLowerCase()}`}>
                                {selectedReport.status}
                            </span>
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReportManagement;
