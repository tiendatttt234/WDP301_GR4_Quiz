"use client"
import { useState, useEffect } from "react"
import "./Account.css"

function AccountManagement() {
  const [accounts, setAccounts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [accountsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    fetch("http://localhost:9999/admin/accounts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Phản hồi mạng không ổn")
        }
        return response.json()
      })
      .then((data) => {
        setAccounts(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error)
        setError("Không thể tải danh sách tài khoản. Vui lòng thử lại sau.")
        setIsLoading(false)
      })
  }, [])

  // Search functionality
  const filteredAccounts = accounts.filter(
    (account) =>
      (account?.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (account?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  // Sort functionality
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortBy === "name") {
      return (a?.userName || "").localeCompare(b?.userName || "")
    } else if (sortBy === "date") {
      return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
    } else if (sortBy === "type") {
      return (b?.isPrime ? 1 : 0) - (a?.isPrime ? 1 : 0)
    }
    return 0
  })

  // Pagination logic
  const indexOfLastAccount = currentPage * accountsPerPage
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage
  const currentAccounts = sortedAccounts.slice(indexOfFirstAccount, indexOfLastAccount)
  const totalPages = Math.ceil(sortedAccounts.length / accountsPerPage)

  // Toggle lock status
  const toggleLock = (id, isLocked) => {
    const newLockStatus = !isLocked
    const token = localStorage.getItem("token")

    fetch(`http://localhost:9999/admin/accounts/${id}/lock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isLocked: newLockStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`)
        }
        return response.json()
      })
      .then((updatedAccount) => {
        setAccounts(accounts.map((account) => (account._id === id ? { ...account, isLocked: newLockStatus } : account)))
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái khóa:", error)
        alert("Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại.")
      })
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>
          <i className="fas fa-users"></i> Quản lý tài khoản
        </h1>
        <div className="account-actions">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sắp xếp theo: Tên</option>
            <option value="date">Sắp xếp theo: Ngày tạo</option>
            <option value="type">Sắp xếp theo: Loại tài khoản</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>
                <i className="fas fa-user"></i> Tên người dùng
              </th>
              <th>
                <i className="fas fa-envelope"></i> Email
              </th>
              <th>
                <i className="fas fa-calendar"></i> Ngày tạo
              </th>
              <th>
                <i className="fas fa-tag"></i> Loại tài khoản
              </th>
              <th>
                <i className="fas fa-toggle-on"></i> Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => (
              <tr key={account._id}>
                <td>{indexOfFirstAccount + index + 1}</td>
                <td>{account.userName}</td>
                <td>{account.email}</td>
                <td>{new Date(account.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <span className={`account-type ${account.isPrime ? "premium" : "basic"}`}>
                    {account.isPrime ? "Cao cấp" : "Thường"}
                  </span>
                </td>
                <td>
                  <button
                    className={`status-toggle ${account.isLocked ? "inactive" : "active"}`}
                    onClick={() => toggleLock(account._id, account.isLocked)}
                  >
                    <i className={`fas ${account.isLocked ? "fa-lock" : "fa-lock-open"}`}></i>
                    {account.isLocked ? "Bị khóa" : "Hoạt động"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="account-footer">
        <div className="pagination-info">
          Hiển thị {sortedAccounts.length > 0 ? indexOfFirstAccount + 1 : 0} đến{" "}
          {Math.min(indexOfLastAccount, sortedAccounts.length)} trong số {sortedAccounts.length} mục
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-arrow"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i> Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            // Show limited page numbers with ellipsis for better UX
            if (
              i === 0 || // First page
              i === totalPages - 1 || // Last page
              (i >= currentPage - 2 && i <= currentPage + 0) // Pages around current
            ) {
              return (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              )
            } else if (i === currentPage - 3 || i === currentPage + 1) {
              // Add ellipsis
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <i className="fas fa-chevron-right"></i> Sau
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountManagement