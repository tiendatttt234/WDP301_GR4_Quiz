import { useState, useEffect } from "react"
import axios from "axios"
import {
  User,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Eye,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import "./Reports.css"

const ReportManagement = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState(null)
  const reportsPerPage = 10

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:9999/admin/reports")
      // Chuẩn hóa status: viết hoa chữ cái đầu
      const reportsWithStatus = (response.data || []).map(report => ({
        ...report,
        status: report.status
          ? report.status.charAt(0).toUpperCase() + report.status.slice(1).toLowerCase()
          : "Pending" // Mặc định là "Pending" nếu không có status
      }))
      setReports(reportsWithStatus)
    } catch (error) {
      setError("Lỗi khi lấy dữ liệu báo cáo")
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) return
    try {
      await axios.delete(`http://localhost:9999/admin/reports/${reportId}`)
      setReports(reports.filter((report) => report._id !== reportId))
      alert("Báo cáo đã được xóa thành công")
    } catch (error) {
      alert("Lỗi khi xóa báo cáo")
    }
  }

  const viewReportDetails = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:9999/admin/reports/${reportId}/details`)
      const report = reports.find((r) => r._id === reportId)
      setSelectedReport({
        ...report,
        questionFile: response.data?.questionFile || {
          name: report.quizName,
          createdBy: "Admin User",
        },
      })
    } catch (error) {
      alert("Lỗi khi lấy chi tiết báo cáo")
    }
  }

  const closeModal = () => {
    setSelectedReport(null)
  }

  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(reports.length / reportsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading)
    return (
      <div className="loadingContainer">
        <p>Đang tải dữ liệu...</p>
      </div>
    )

  if (error)
    return (
      <div className="errorMessage">
        <AlertTriangle size={20} /> {error}
      </div>
    )

  return (
    <div className="reportsContainer">
      <div className="reportsHeader">
        <h1>
          <AlertTriangle size={24} color="#f59e0b" className="mr-2" /> Báo cáo
        </h1>
      </div>

      <div className="tableContainer">
        <table className="reportsTable">
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
                <td>{indexOfFirstReport + index + 1}</td> {/* Hiển thị STT */}
                <td>
                  <div className="flex items-center">
                    <User size={16} className="mr-2" /> {report.sender}
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2" /> {report.quizName}
                  </div>
                </td>
                <td>{report.reason}</td>
                <td>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" /> {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    {report.status === "Pending" && (
                      <span className="statusBadge pending">
                        <Clock size={16} className="mr-1" /> Pending
                      </span>
                    )}
                    {report.status === "Resolved" && (
                      <span className="statusBadge resolved">
                        <CheckCircle size={16} className="mr-1" /> Resolved
                      </span>
                    )}
                    {report.status === "Rejected" && (
                      <span className="statusBadge rejected">
                        <X size={16} className="mr-1" /> Rejected
                      </span>
                    )}
                    {/* Hiển thị nếu status không khớp */}
                    {!["Pending", "Resolved", "Rejected"].includes(report.status) && (
                      <span className="statusBadge pending">
                        <Clock size={16} className="mr-1" /> {report.status || "Pending"}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="actionBtn view" onClick={() => viewReportDetails(report._id)}>
                      <Eye size={16} className="mr-1" /> View
                    </button>
                    <button className="actionBtn delete" onClick={() => deleteReport(report._id)}>
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>

        {currentPage > 1 && (
          <button onClick={() => paginate(1)} className="px-3 py-1 rounded border hover:bg-gray-100">
            1
          </button>
        )}

        {currentPage > 2 && <span className="px-2">...</span>}

        <button className="px-3 py-1 rounded border bg-blue-500 text-white">{currentPage}</button>

        {currentPage < totalPages - 1 && <span className="px-2">...</span>}

        {currentPage < totalPages && (
          <button onClick={() => paginate(totalPages)} className="px-3 py-1 rounded border hover:bg-gray-100">
            {totalPages}
          </button>
        )}

        <button
          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>Chi tiết báo cáo</h2>
              <button className="closeBtn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="mb-2">
                <strong>
                  <User size={16} className="inline mr-2" /> Người gửi:
                </strong>{" "}
                {selectedReport.sender}
              </p>
              <p className="mb-2">
                <strong>
                  <FileText size={16} className="inline mr-2" /> Bộ Câu hỏi:
                </strong>{" "}
                {selectedReport.questionFile?.name || "Không có dữ liệu"}
              </p>
              <p className="mb-2">
                <strong>Người tạo Quiz:</strong> {selectedReport.questionFile?.createdBy || "Không có dữ liệu"}
              </p>
              <p className="mb-2">
                <strong>Lý do:</strong> {selectedReport.reason}
              </p>
              <p className="mb-2">
                <strong>Trạng thái:</strong>
                {selectedReport.status === "Pending" && (
                  <span className="statusBadge pending ml-2">
                    <Clock size={16} className="mr-1" /> Pending
                  </span>
                )}
                {selectedReport.status === "Resolved" && (
                  <span className="statusBadge resolved ml-2">
                    <CheckCircle size={16} className="mr-1" /> Resolved
                  </span>
                )}
                {selectedReport.status === "Rejected" && (
                  <span className="statusBadge rejected ml-2">
                    <X size={16} className="mr-1" /> Rejected
                  </span>
                )}
                {!["Pending", "Resolved", "Rejected"].includes(selectedReport.status) && (
                  <span className="statusBadge pending ml-2">
                    <Clock size={16} className="mr-1" /> {selectedReport.status || "Pending"}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportManagement