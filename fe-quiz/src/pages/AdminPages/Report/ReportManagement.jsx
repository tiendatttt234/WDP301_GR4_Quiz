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
      setError("Failed to fetch reports data")
      setLoading(false)
    }
  }

  const viewReportDetails = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`)
      setSelectedReport(response.data)
      setViewDetailsOpen(true)
    } catch (error) {
      alert("Error fetching report details")
    }
  }

  const viewQuestionFileReported = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`)
      const questionFileReported = response.data.questionFile
      const questionFileId = questionFileReported.qf_id
      navigate(`/admin/view-question-detail/${questionFileId}`)
    } catch (error) {
      alert("Error fetching reported question file data")
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
      alert("Error fetching report details for handling")
    }
  }

  const submitHandleReport = async () => {
    const confirmMessage =
      handleStatus === "approved"
        ? `Are you sure you want to ${actionType} this question file and send a notification to the creator?`
        : "Are you sure you want to reject this report?"

    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setIsSubmitting(true)

      if (handleStatus === "approved") {
        if (!actionType) {
          alert("Please select an action (Lock or Delete)")
          setIsSubmitting(false)
          return
        }
        if (!handleMessage.trim()) {
          alert("Please enter a message for the creator")
          setIsSubmitting(false)
          return
        }

        // Handle lock or delete question file
        await axios.put(`http://localhost:9999/admin/reports/${selectedReport?._id}/action`, {
          action: actionType.toLowerCase(),
        })

        // Send notification to the creator
        await axios.post("http://localhost:9999/notifycation/notify", {
          recipientId: selectedReport?.questionFile?.qf_createdById,
          type: "Warning",
          message: `Your question file "${selectedReport?.questionFile?.qf_name}" has been ${
            actionType === "lock" ? "locked" : "deleted"
          }. Reason: ${handleMessage}`,
        })
      }

      // Update report status
      await axios.put(`http://localhost:9999/admin/reports/${selectedReport?._id}/status`, {
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
      alert(`Report has been processed successfully with status: ${handleStatus}`)
    } catch (error) {
      setIsSubmitting(false)
      alert("Error processing report: " + error.message)
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

    switch (status.toLowerCase()) {
      case "pending":
        badgeClass += " status-pending"
        break
      case "approved":
        badgeClass += " status-approved"
        break
      case "rejected":
        badgeClass += " status-rejected"
        break
      default:
        break
    }

    return <span className={badgeClass}>{status}</span>
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
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Report Management</h1>
        <div className="header-controls">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search reports..."
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
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="approved">Approved ({statusCounts.approved})</option>
              <option value="rejected">Rejected ({statusCounts.rejected})</option>
            </select>
          </div>

          {/* <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by: Date</option>
            <option value="status">Sort by: Status</option>
          </select> */}
        </div>
      </div>

      <div className="report-card">
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th className="column-small">No.</th>
                <th>Sender</th>
                <th>Name Question File</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th className="column-actions">Action</th>
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
                  <td>
                    <span className={`status-badge status-${report.status.toLowerCase()}`}>{report.status}</span>
                  </td>
                  <td className="column-actions">
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => viewReportDetails(report._id)} title="View Details">
                        <Eye size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => viewQuestionFileReported(report._id)}
                        title="View File"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleReport(report._id)}
                        disabled={report.status === "approved" || report.status === "rejected"}
                        title="Handle Report"
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
              <h3>No Reports Found</h3>
              <p>There are no reports to display at this time.</p>
            </div>
          )}
          <div className="table-footer">
            Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, filteredReports.length)} of{" "}
            {filteredReports.length} entries
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
              <span>Previous</span>
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
              <span>Next</span>
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
              <h2>Report Details</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="report-info-header">
                <div className="status-badge status-pending">{selectedReport.status || "PENDING"}</div>
                <div className="report-date">
                  Reported on {new Date(selectedReport.createdAt).toLocaleDateString() || "Invalid Date"}
                </div>
              </div>

              <div className="report-section">
                <h3 className="report-section-title">Sender</h3>
                <div className="sender-profile">
                  <div className="sender-username">{selectedReport.sender || "Unknown"}</div>
                </div>
              </div>

              <div className="report-section">
                <h3 className="report-section-title">Question File Information</h3>
                <div className="detail-row">
                  <div className="detail-label">Question File:</div>
                  <div className="detail-value">{selectedReport.questionFile?.qf_name || "No data available"}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Create By: </div>
                  <div className="detail-value">{selectedReport.questionFile?.qf_createdBy || "No data available"}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Reason:</div>
                  <div className="report-reason">{selectedReport.reason || "No reason provided"}</div>
                </div>
                
              </div>

              {/* <div className="report-actions">
                <button className="btn btn-outline" onClick={() => viewQuestionFileReported(selectedReport._id)}>
                  <FileText size={16} />
                  <span>View Question File</span>
                </button>
                {selectedReport.status === "pending" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      closeModal()
                      handleReport(selectedReport._id)
                    }}
                  >
                    <Settings size={16} />
                    <span>Handle Report</span>
                  </button>
                )}
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Handle Report Modal */}
      {showHandlePopup && selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Handle Report</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <div className="form-header">
                  <h3>Report Information</h3>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Question File:</span>
                    <span className="info-value">{selectedReport.questionFile?.qf_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Reason:</span>
                    <span className="info-value">{selectedReport.reason}</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="handleStatus">Status</label>
                <select
                  id="handleStatus"
                  className="form-select"
                  value={handleStatus}
                  onChange={(e) => setHandleStatus(e.target.value)}
                >
                  <option value="approved">Approve Report</option>
                  <option value="rejected">Reject Report</option>
                </select>
              </div>

              {handleStatus === "approved" && (
                <>
                  <div className="form-group">
                    <label htmlFor="actionType">Action</label>
                    <select
                      id="actionType"
                      className="form-select"
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value)}
                    >
                      <option value="">Select action</option>
                      <option value="lock">Lock Question File</option>
                      <option value="delete">Delete Question File</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="handleMessage">Notification message</label>
                    <textarea
                      id="handleMessage"
                      className="form-textarea"
                      value={handleMessage}
                      onChange={(e) => setHandleMessage(e.target.value)}
                      placeholder="Enter message for the creator..."
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitHandleReport} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

