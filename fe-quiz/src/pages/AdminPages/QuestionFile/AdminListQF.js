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
        const response = await axios.get("http://localhost:9999/questionFile/getQFadmin")

        if (response.data.success) {
          setQuestionFiles(response.data.data)
        } else {
          setError("Failed to fetch question files")
        }
      } catch (error) {
        console.error("Error fetching question files:", error)
        setError("Error connecting to server. Please try again later.")
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

  // For demo purposes with fake data
  const demoQuestionFiles = [
    {
      id: 1,
      name: "English Grammar Quiz",
      userName: "johndoe",
      isPrivate: false,
      isReported: true,
      reportedCount: 3,
      isLocked: true,
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-06-20T14:45:00Z",
    },
    {
      id: 2,
      name: "Math Fundamentals",
      userName: "janesmit",
      isPrivate: true,
      isReported: false,
      reportedCount: 0,
      isLocked: false,
      createdAt: "2023-04-10T09:15:00Z",
      updatedAt: "2023-04-10T09:15:00Z",
    },
    {
      id: 3,
      name: "Science Trivia",
      userName: "mikebrown",
      isPrivate: false,
      isReported: true,
      reportedCount: 1,
      isLocked: false,
      createdAt: "2023-03-22T16:20:00Z",
      updatedAt: "2023-05-18T11:30:00Z",
    },
    {
      id: 4,
      name: "History Facts",
      userName: "sarahjones",
      isPrivate: true,
      isReported: false,
      reportedCount: 0,
      isLocked: false,
      createdAt: "2023-02-15T13:45:00Z",
      updatedAt: "2023-02-15T13:45:00Z",
    },
    {
      id: 5,
      name: "Geography Challenge",
      userName: "robertwilson",
      isPrivate: false,
      isReported: true,
      reportedCount: 2,
      isLocked: true,
      createdAt: "2023-01-08T08:30:00Z",
      updatedAt: "2023-03-12T15:10:00Z",
    },
  ]

  // Use demo data for preview
  const displayItems = currentItems.length > 0 ? currentItems : demoQuestionFiles

  return (
    <div className="admin-qf-container">
      <div className="admin-qf-header">
        <h1>
          <i className="fas fa-file-alt"></i> Question Files Management
        </h1>
        <div className="admin-qf-actions">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by name or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Files</option>
            <option value="reported">Reported</option>
            <option value="locked">Locked</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading question files...</p>
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
                    <i className="fas fa-file-signature"></i> File Name
                  </th>
                  <th>
                    <i className="fas fa-user"></i> Created By
                  </th>
                  <th>
                    <i className="fas fa-lock"></i> Privacy
                  </th>
                  <th>
                    <i className="fas fa-flag"></i> Reported
                  </th>
                  <th>
                    <i className="fas fa-exclamation-circle"></i> Report Count
                  </th>
                  <th>
                    <i className="fas fa-ban"></i> Status
                  </th>
                  <th>
                    <i className="fas fa-calendar-alt"></i> Created
                  </th>
                  <th>
                    <i className="fas fa-calendar-check"></i> Updated
                  </th>
                  <th>
                    <i className="fas fa-cogs"></i> Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((qf, index) => (
                  <tr key={qf.id}>
                    <td className="index-cell">{indexOfFirstItem + index + 1}</td>
                    <td className="file-name-cell">{qf.name}</td>
                    <td>{qf.userName}</td>
                    <td>
                      <span className={`status-badge ${qf.isPrivate ? "private" : "public"}`}>
                        <i className={`fas ${qf.isPrivate ? "fa-lock" : "fa-globe"}`}></i>
                        {qf.isPrivate ? "Private" : "Public"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${qf.isReported ? "reported" : "not-reported"}`}>
                        <i className={`fas ${qf.isReported ? "fa-flag" : "fa-check"}`}></i>
                        {qf.isReported ? "Yes" : "No"}
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
                        {qf.isLocked ? "Locked" : "Active"}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(qf.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="date-cell">
                      {new Date(qf.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button className="action-btn view" onClick={() => viewQuestionFileReported(qf.id)}>
                        <i className="fas fa-eye"></i> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-qf-footer">
            <div className="pagination-info">
              Showing {filteredQuestionFiles.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
              {Math.min(indexOfLastItem, filteredQuestionFiles.length)} of {filteredQuestionFiles.length} entries
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-arrow"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 0)) {
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
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminListQF

