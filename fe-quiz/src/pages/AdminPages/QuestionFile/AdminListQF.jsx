"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./AdminListQF.css"

const AdminListQF = () => {
    const [questionFiles, setQuestionFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const navigate = useNavigate()

    // Fetch data from the API
    useEffect(() => {
        const fetchQuestionFiles = async () => {
            setLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem("accessToken")
                const response = await axios.get("http://localhost:9999/questionFile/getQFadmin", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.data.success) {
                    setQuestionFiles(response.data.data)
                } else {
                    setError("Không thể tải danh sách tệp câu hỏi")
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tệp câu hỏi:", error)
                setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.")
            } finally {
                setLoading(false)
            }
        }

        fetchQuestionFiles()
    }, [])

    const viewQuestionFileReported = (qfId) => {
        navigate(`/admin/view-question-detail/${qfId}`)
    }

    // Filter and search functionality
    const filteredQuestionFiles = questionFiles.filter((qf) => {
        const matchesSearch =
            qf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qf.userName.toLowerCase().includes(searchTerm.toLowerCase())

        if (filterStatus === "all") return matchesSearch
        if (filterStatus === "reported") return qf.isReported && matchesSearch
        if (filterStatus === "locked") return qf.isLocked && matchesSearch
        if (filterStatus === "private") return qf.isPrivate && matchesSearch

        return matchesSearch
    })

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredQuestionFiles.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredQuestionFiles.length / itemsPerPage)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div className="admin-qf-container">
            <div className="admin-qf-header">
                <h1>
                    <i className="fas fa-file-alt"></i> Quản lý tệp câu hỏi
                </h1>
                <div className="admin-qf-actions">
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">Tất cả tệp</option>
                        <option value="reported">Đã báo cáo</option>
                        <option value="locked">Đã khóa</option>
                        <option value="private">Riêng tư</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang tải danh sách tệp câu hỏi...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    <div className="table-container">
                        <table className="qf-table">
                            <thead>
                                <tr>
                                    <th>
                                        <i className="fas fa-hashtag"></i> STT
                                    </th>
                                    <th>
                                        <i className="fas fa-file-signature"></i> Tên tệp
                                    </th>
                                    <th>
                                        <i className="fas fa-user"></i> Người tạo
                                    </th>
                                    <th>
                                        <i className="fas fa-lock"></i> Quyền riêng tư
                                    </th>
                                    <th>
                                        <i className="fas fa-flag"></i> Báo cáo
                                    </th>
                                    <th>
                                        <i className="fas fa-exclamation-circle"></i> Số lần báo cáo
                                    </th>
                                    <th>
                                        <i className="fas fa-ban"></i> Trạng thái
                                    </th>
                                    <th>
                                        <i className="fas fa-calendar-alt"></i> Ngày tạo
                                    </th>
                                    <th>
                                        <i className="fas fa-calendar-check"></i> Ngày cập nhật
                                    </th>
                                    <th>
                                        <i className="fas fa-cogs"></i> Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((qf, index) => (
                                    <tr key={qf.id}>
                                        <td className="index-cell">{indexOfFirstItem + index + 1}</td>
                                        <td className="file-name-cell">{qf.name}</td>
                                        <td>{qf.userName}</td>
                                        <td>
                                            <span className={`status-badge ${qf.isPrivate ? "private" : "public"}`}>
                                                <i className={`fas ${qf.isPrivate ? "fa-lock" : "fa-globe"}`}></i>
                                                {qf.isPrivate ? "Riêng tư" : "Công khai"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${qf.isReported ? "reported" : "not-reported"}`}>
                                                <i className={`fas ${qf.isReported ? "fa-flag" : "fa-check"}`}></i>
                                                {qf.isReported ? "Có" : "Không"}
                                            </span>
                                        </td>
                                        <td className="report-count">
                                            {qf.reportedCount > 0 ? (
                                                <span className="count-badge">{qf.reportedCount}</span>
                                            ) : (
                                                <span className="zero-count">0</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${qf.isLocked ? "locked" : "active"}`}>
                                                <i className={`fas ${qf.isLocked ? "fa-ban" : "fa-check-circle"}`}></i>
                                                {qf.isLocked ? "Đã khóa" : "Hoạt động"}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(qf.createdAt).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="date-cell">
                                            {new Date(qf.updatedAt).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td>
                                            <button className="action-btn view" onClick={() => viewQuestionFileReported(qf.id)}>
                                                <i className="fas fa-eye">Xem</i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-qf-footer">
                        <div className="pagination-info">
                            Hiển thị {filteredQuestionFiles.length > 0 ? indexOfFirstItem + 1 : 0} đến{" "}
                            {Math.min(indexOfLastItem, filteredQuestionFiles.length)} trong số {filteredQuestionFiles.length} mục
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="pagination-arrow"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left">Trước</i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => {
                                if (totalPages === 0 || i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 0)) {
                                    return (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={currentPage === i + 1 ? "active" : ""}
                                        >
                                            {i + 1}
                                        </button>
                                    )
                                } else if (i === currentPage - 3 || i === currentPage + 1) {
                                    return (
                                        <span key={i} className="pagination-ellipsis">
                                            ...
                                        </span>
                                    )
                                }
                                return null
                            })}

                            <button
                                className="pagination-arrow"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                <i className="fas fa-chevron-right">Sau</i>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminListQF