"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, FileText, AlertCircle, Loader2, X, ChevronLeft, ChevronRight, Search, Settings } from "lucide-react"
import "./Reports.css"

export default function ReportManagement() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showHandlePopup, setShowHandlePopup] = useState(false)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [handleMessage, setHandleMessage] = useState("")
  const [handleStatus, setHandleStatus] = useState("approved")
  const [actionType, setActionType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reportsPerPage = 10
  const navigate = useNavigate()

  // Add these new state variables at the top of your component
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [statusFilter, setStatusFilter] = useState("all") // New status filter state

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:9999/admin/reports")
      setReports(response.data)
      setLoading(false)
    } catch (error) {
      setError("Không thể tải dữ liệu báo cáo")
      setLoading(false)
    }
  }

  const viewReportDetails = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`)
      setSelectedReport(response.data)
      setViewDetailsOpen(true)
    } catch (error) {
      alert("Lỗi khi lấy chi tiết báo cáo")
    }
  }

  const viewQuestionFileReported = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`)
      const questionFileReported = response.data.questionFile
      const questionFileId = questionFileReported.qf_id
      navigate(`/admin/view-question-detail/${questionFileId}`)
    } catch (error) {
      alert("Lỗi khi lấy dữ liệu tệp câu hỏi bị báo cáo")
    }
  }

  const handleReport = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`)
      setSelectedReport(response.data)
      setShowHandlePopup(true)
      setActionType("")
      setHandleMessage("")
      setHandleStatus("approved")
    } catch (error) {
      alert("Lỗi khi lấy chi tiết báo cáo để xử lý")
    }
  }

  const submitHandleReport = async () => {
    const confirmMessage =
      handleStatus === "approved"
        ? `Bạn có chắc chắn muốn ${actionType === "lock" ? "khóa" : "xóa"} tệp câu hỏi này và gửi thông báo cho người tạo không?`
        : "Bạn có chắc chắn muốn từ chối báo cáo này không?"

    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setIsSubmitting(true)

      if (handleStatus === "approved") {
        if (!actionType) {
          alert("Vui lòng chọn một hành động (Khóa hoặc Xóa)")
          setIsSubmitting(false)
          return
        }
        if (!handleMessage.trim()) {
          alert("Vui lòng nhập thông điệp cho người tạo")
          setIsSubmitting(false)
          return
        }
        console.log("Selected report:", selectedReport.report_id);
        
        // Handle lock or delete question file
        await axios.put(`http://localhost:9999/admin/reports/${selectedReport.report_id}/action`, {
          action: actionType.toLowerCase(),
        })

        // Send notification to the creator
        await axios.post("http://localhost:9999/notifycation/notify", {
          recipientId: selectedReport?.questionFile?.qf_createdById,
          type: "Alert",
          message: `Tệp câu hỏi của bạn "${selectedReport?.questionFile?.qf_name}" đã bị ${
            actionType === "lock" ? "khóa" : "xóa"
          }. Lý do: ${handleMessage}`,
        })
      }

      // Update report status
      await axios.put(`http://localhost:9999/admin/reports/${selectedReport.report_id}/status`, {
        status: handleStatus,
      })

      // Refresh reports list
      await fetchReports()

      setShowHandlePopup(false)
      setHandleMessage("")
      setHandleStatus("approved")
      setActionType("")
      setSelectedReport(null)
      setIsSubmitting(false)
      alert(`Báo cáo đã được xử lý thành công với trạng thái: ${handleStatus === "approved" ? "Đã duyệt" : "Đã từ chối"}`)
    } catch (error) {
      setIsSubmitting(false)
      alert("Lỗi khi xử lý báo cáo: " + error.message)
    }
  }

  const closeModal = () => {
    setSelectedReport(null)
    setShowHandlePopup(false)
    setViewDetailsOpen(false)
    setHandleMessage("")
    setHandleStatus("approved")
    setActionType("")
  }

  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage

  // Apply search, sort, and status filter
  const filteredReports = reports.filter((report) => {
    // First apply status filter
    if (statusFilter !== "all" && report.status.toLowerCase() !== statusFilter) {
      return false
    }

    // Then apply search filter
    return (
      report.quizName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (sortBy === "date") {
    filteredReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy === "sender") {
    filteredReports.sort((a, b) => a.sender.localeCompare(b.sender))
  } else if (sortBy === "status") {
    filteredReports.sort((a, b) => a.status.localeCompare(b.status))
  }

  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getStatusBadge = (status) => {
    let badgeClass = "status-badge"
    let statusText = ""

    switch (status.toLowerCase()) {
      case "pending":
        badgeClass += " status-pending"
        statusText = "Đang chờ"
        break
      case "approved":
        badgeClass += " status-approved"
        statusText = "Đã duyệt"
        break
      case "rejected":
        badgeClass += " status-rejected"
        statusText = "Đã từ chối"
        break
      default:
        break
    }

    return <span className={badgeClass}>{statusText}</span>
  }

  // Get counts for each status
  const statusCounts = {
    all: reports.length,
    pending: reports.filter((report) => report.status.toLowerCase() === "pending").length,
    approved: reports.filter((report) => report.status.toLowerCase() === "approved").length,
    rejected: reports.filter((report) => report.status.toLowerCase() === "rejected").length,
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-alert">
        <div className="error-icon">
          <AlertCircle />
        </div>
        <div className="error-content">
          <h4>Lỗi</h4>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Quản Lý Báo Cáo</h1>
        <div className="header-controls">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm báo cáo..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter dropdown */}
          <div className="filter-wrapper">
            <select
              className="filter-select status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất Cả Trạng Thái ({statusCounts.all})</option>
              <option value="pending">Đang chờ ({statusCounts.pending})</option>
              <option value="approved">Đã duyệt ({statusCounts.approved})</option>
              <option value="rejected">Đã từ chối ({statusCounts.rejected})</option>
            </select>
          </div>
        </div>
      </div>

      <div className="report-card">
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th className="column-small">STT</th>
                <th>Người gửi</th>
                <th>Tên tệp câu hỏi</th>
                <th>Lý do</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th className="column-actions">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report, index) => (
                <tr key={report._id}>
                  <td className="column-small">{indexOfFirstReport + index + 1}</td>
                  <td>
                    <div className="sender-info">
                      <div className="sender-avatar">{report.sender.charAt(0).toUpperCase()}</div>
                      <span>{report.sender}</span>
                    </div>
                  </td>
                  <td className="truncate-text">{report.quizName}</td>
                  <td className="truncate-text reason-cell">{report.reason}</td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td className="column-actions">
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => viewReportDetails(report._id)} title="Xem chi tiết">
                        <Eye size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => viewQuestionFileReported(report._id)}
                        title="Xem tệp"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleReport(report._id)}
                        disabled={report.status === "approved" || report.status === "rejected"}
                        title="Xử lý báo cáo"
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentReports.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Không tìm thấy báo cáo</h3>
              <p>Hiện tại không có báo cáo nào để hiển thị.</p>
            </div>
          )}
          <div className="table-footer">
            Hiển thị {indexOfFirstReport + 1} đến {Math.min(indexOfLastReport, filteredReports.length)} trong số{" "}
            {filteredReports.length} mục
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              <span>Trước</span>
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <span>Tiếp</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Redesigned View Details Modal */}
      {viewDetailsOpen && selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="report-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-details-header">
              <h2>Chi tiết báo cáo</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="report-info-header">
                <div className="status-badge status-pending">{getStatusBadge(selectedReport.status)}</div>
                <div className="report-date">
                  Báo cáo vào ngày {new Date(selectedReport.createdAt).toLocaleDateString() || "Ngày không hợp lệ"}
                </div>
              </div>

              <div className="report-section">
                <h3 className="report-section-title">Người gửi</h3>
                <div className="sender-profile">
                  <div className="sender-username">{selectedReport.sender || "Không xác định"}</div>
                </div>
              </div>

              <div className="report-section">
                <h3 className="report-section-title">Thông tin tệp câu hỏi</h3>
                <div className="detail-row">
                  <div className="detail-label">Tệp câu hỏi:</div>
                  <div className="detail-value">{selectedReport.questionFile?.qf_name || "Không có dữ liệu"}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Người tạo: </div>
                  <div className="detail-value">{selectedReport.questionFile?.qf_createdBy || "Không có dữ liệu"}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Lý do:</div>
                  <div className="report-reason">{selectedReport.reason || "Không có lý do nào được cung cấp"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Handle Report Modal */}
      {showHandlePopup && selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Xử lý báo cáo</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <div className="form-header">
                  <h3>Thông tin báo cáo</h3>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Tệp câu hỏi:</span>
                    <span className="info-value">{selectedReport.questionFile?.qf_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Lý do:</span>
                    <span className="info-value">{selectedReport.reason}</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="handleStatus">Trạng thái</label>
                <select
                  id="handleStatus"
                  className="form-select"
                  value={handleStatus}
                  onChange={(e) => setHandleStatus(e.target.value)}
                >
                  <option value="approved">Duyệt báo cáo</option>
                  <option value="rejected">Từ chối báo cáo</option>
                </select>
              </div>

              {handleStatus === "approved" && (
                <>
                  <div className="form-group">
                    <label htmlFor="actionType">Hành động</label>
                    <select
                      id="actionType"
                      className="form-select"
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value)}
                    >
                      <option value="">Chọn hành động</option>
                      <option value="lock">Khóa tệp câu hỏi</option>
                      <option value="delete">Xóa tệp câu hỏi</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="handleMessage">Thông điệp thông báo</label>
                    <textarea
                      id="handleMessage"
                      className="form-textarea"
                      value={handleMessage}
                      onChange={(e) => setHandleMessage(e.target.value)}
                      placeholder="Nhập thông điệp cho người tạo..."
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={submitHandleReport} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Gửi</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}