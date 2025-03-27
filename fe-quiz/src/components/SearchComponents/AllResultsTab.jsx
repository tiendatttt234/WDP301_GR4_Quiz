"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const AllResultsTab = ({ searchResults }) => {
  const navigate = useNavigate()
  const MAX_PREVIEW = 3
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePreview = async (id) => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:9999/questionFile/getById/${id}`)
      console.log("Preview response:", response.data)
      if (response.data.questionFile) {
        setSelectedItem(response.data.questionFile)
        setModalOpen(true)
      } else {
        toast.error("Không thể tải dữ liệu học phần!")
      }
    } catch (error) {
      console.error("Error fetching question file:", error)
      toast.error("Đã xảy ra lỗi khi tải dữ liệu học phần!")
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  // Click handler to navigate to QuestionFileDetail
  const handleStudyClick = () => {
    if (!selectedItem?._id) {
      toast.error("Học phần không hợp lệ, vui lòng thử lại!");
      return;
    }

    // Close the modal first for a smoother transition
    setModalOpen(false);

    // Navigate to QuestionFileDetail with a slight delay
    setTimeout(() => {
      navigate(`/questionfile/detail/${selectedItem._id}`); // Updated route
      setSelectedItem(null); // Reset selectedItem after navigation
    }, 300); // 300ms delay
  }

  const handleViewAllQuestionFiles = () =>
    navigate(
      `/search?tab=questionFiles&keyword=${encodeURIComponent(searchResults.results.questionFiles[0]?.name || "")}`,
    )
  const handleViewAllUsers = () =>
    navigate(`/search?tab=users&keyword=${encodeURIComponent(searchResults.results.users[0]?.userName || "")}`)

  const previewQuestionFiles = searchResults.results.questionFiles.slice(0, MAX_PREVIEW)
  const previewUsers = searchResults.results.users.slice(0, MAX_PREVIEW)

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        color: "#333",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {searchResults.results.questionFiles.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #eaeaea",
              paddingBottom: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#2563eb",
                margin: 0,
              }}
            >
              Học phần ({searchResults.breakdown.questionFiles})
            </h2>
            {searchResults.breakdown.questionFiles > MAX_PREVIEW && (
              <a
                style={{
                  color: "#2563eb",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onClick={handleViewAllQuestionFiles}
                onMouseOver={(e) => (e.currentTarget.style.color = "#1e40af")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#2563eb")}
              >
                Xem tất cả
                <span style={{ marginLeft: "5px" }}>→</span>
              </a>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {previewQuestionFiles.map((qf) => (
              <div
                key={qf._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  border: "1px solid #eaeaea",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.08)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)"
                }}
              >
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginTop: 0,
                      marginBottom: "12px",
                      color: "#111827",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      height: "50px",
                    }}
                  >
                    {qf.name}
                  </h3>
                  <div
                    style={{
                      marginBottom: "15px",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        backgroundColor: "#f3f4f6",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontWeight: "500",
                      }}
                    >
                      {qf.arrayQuestion.length} câu hỏi
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: "15px",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          marginRight: "10px",
                          backgroundColor: "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={qf.createdBy?.avatar || "/placeholder.svg?height=32&width=32"}
                          alt="Avatar"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=32&width=32"
                          }}
                        />
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#4b5563",
                            display: "block",
                            lineHeight: "1.2",
                          }}
                        >
                          {qf.createdBy?.userName || "Không xác định"}
                        </span>
                      </div>
                    </div>
                    <button
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                      onClick={() => handlePreview(qf._id)}
                    >
                      Xem trước
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.results.users.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #eaeaea",
              paddingBottom: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#2563eb",
                margin: 0,
              }}
            >
              Người dùng ({searchResults.breakdown.users})
            </h2>
            {searchResults.breakdown.users > MAX_PREVIEW && (
              <a
                style={{
                  color: "#2563eb",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onClick={handleViewAllUsers}
                onMouseOver={(e) => (e.currentTarget.style.color = "#1e40af")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#2563eb")}
              >
                Xem tất cả
                <span style={{ marginLeft: "5px" }}>→</span>
              </a>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {previewUsers.map((user) => (
              <div
                key={user._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  border: "1px solid #eaeaea",
                }}
                onClick={() => navigate(`/users/${user._id}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.08)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)"
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginBottom: "15px",
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid #f3f4f6",
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.userName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=80&width=80"
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#2563eb",
                        color: "white",
                        fontSize: "32px",
                        fontWeight: "bold",
                      }}
                    >
                      {user.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: "0 0 10px 0",
                    color: "#111827",
                  }}
                >
                  {user.userName}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f3f4f6",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: "#4b5563",
                    fontWeight: "500",
                  }}
                >
                  <span style={{ marginRight: "5px" }}>📚</span>
                  <span>{user.questionFileCount || 0} học phần</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalOpen && selectedItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #eaeaea",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: 0,
                  color: "#111827",
                }}
              >
                {selectedItem.name}
              </h3>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  color: "#6b7280",
                  transition: "background-color 0.2s ease",
                }}
                onClick={closeModal}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6"
                  e.currentTarget.style.color = "#111827"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = "#6b7280"
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px 0",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "4px solid #f3f4f6",
                      borderTopColor: "#2563eb",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </div>
              ) : selectedItem.arrayQuestion?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {selectedItem.arrayQuestion.map((question, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "10px",
                        padding: "20px",
                        border: "1px solid #eaeaea",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#2563eb",
                            fontSize: "16px",
                          }}
                        >
                          Câu {index + 1}
                        </span>
                        <span
                          style={{
                            backgroundColor: "#e0e7ff",
                            color: "#4338ca",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {question.type === "MCQ" ? "(Một đáp án)" : "(Nhiều đáp án)"}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "16px",
                          marginTop: 0,
                          marginBottom: "16px",
                          color: "#111827",
                          fontWeight: "500",
                          lineHeight: "1.5",
                        }}
                      >
                        {question.content}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {question.answers.map((answer, ansIndex) => (
                          <div
                            key={ansIndex}
                            style={{
                              padding: "12px 16px",
                              borderRadius: "8px",
                              backgroundColor: answer.isCorrect ? "#ecfdf5" : "#fff",
                              border: `1px solid ${answer.isCorrect ? "#10b981" : "#e5e7eb"}`,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "15px",
                                color: answer.isCorrect ? "#047857" : "#374151",
                                fontWeight: answer.isCorrect ? "500" : "normal",
                              }}
                            >
                              {answer.answerContent}
                            </span>
                            {answer.isCorrect && (
                              <span
                                style={{
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                ✓ Đáp án đúng
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#6b7280",
                    padding: "40px 0",
                  }}
                >
                  Không có câu hỏi để hiển thị
                </p>
              )}
            </div>
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #eaeaea",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onClick={handleStudyClick} // Navigate to QuestionFileDetail
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
              >
                Học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllResultsTab