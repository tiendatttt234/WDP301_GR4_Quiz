"use client"

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const QuestionFilesTab = ({ searchResults }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ termCount: "" }); // Chỉ giữ bộ lọc Số thuật ngữ
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!searchResults || !searchResults.results || !searchResults.results.questionFiles) {
      setData([]);
      setFilteredData([]);
      setSelectedItem(null);
      return;
    }

    setLoading(true);
    try {
      let questionFiles = searchResults.results.questionFiles || [];

      // Áp dụng bộ lọc
      let filtered = [...questionFiles];

      // Lọc theo số thuật ngữ
      if (filters.termCount) {
        if (filters.termCount === "under19") {
          filtered = filtered.filter(qf => qf.arrayQuestion.length < 19);
        } else if (filters.termCount === "20to49") {
          filtered = filtered.filter(qf => qf.arrayQuestion.length >= 20 && qf.arrayQuestion.length <= 49);
        } else if (filters.termCount === "50plus") {
          filtered = filtered.filter(qf => qf.arrayQuestion.length >= 50);
        }
      }

      setData(questionFiles);
      setFilteredData(filtered);
      if (filtered.length > 0) {
        setSelectedItem(filtered[0]);
      } else {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error processing question files:", error);
      toast.error("Đã xảy ra lỗi khi xử lý học phần!", {
        position: "top-right",
        autoClose: 2000,
      });
      setData([]);
      setFilteredData([]);
      setSelectedItem(null);
    } finally {
      setLoading(false);
    }
  }, [searchResults, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f4f6",
            borderTopColor: "#4f46e5",
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
    );
  }

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
      <div
        style={{
          marginBottom: "20px",
          backgroundColor: "#f9fafb",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <label
            style={{
              fontWeight: "500",
              fontSize: "14px",
              color: "#4b5563",
              minWidth: "100px",
            }}
          >
            Số thuật ngữ:
          </label>
          <select
            name="termCount"
            value={filters.termCount}
            onChange={handleFilterChange}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              fontSize: "14px",
              color: "#374151",
              width: "150px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Tất cả</option>
            <option value="under19">&lt; 19</option>
            <option value="20to49">20 - 49 thuật ngữ</option>
            <option value="50plus">50+ thuật ngữ</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "30% 70%",
          gap: "20px",
          height: "calc(100vh - 200px)",
          minHeight: "500px",
        }}
      >
        {/* Left Column - Study Sets */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              padding: "15px 20px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                margin: 0,
                color: "#111827",
              }}
            >
              Học phần
            </h2>
          </div>

          <div
            style={{
              overflowY: "auto",
              flex: 1,
              padding: "10px",
            }}
          >
            {filteredData.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {filteredData.map((qf) => (
                  <div
                    key={qf._id}
                    style={{
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: selectedItem?._id === qf._id ? "#f0f7ff" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderLeft: selectedItem?._id === qf._id ? "4px solid #4f46e5" : "1px solid #e5e7eb",
                    }}
                    onClick={() => setSelectedItem(qf)}
                    onMouseOver={(e) => {
                      if (selectedItem?._id !== qf._id) {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedItem?._id !== qf._id) {
                        e.currentTarget.style.backgroundColor = "#fff";
                      }
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          margin: "0 0 5px 0",
                          color: "#111827",
                        }}
                      >
                        {qf.name}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#6b7280",
                            backgroundColor: "#f3f4f6",
                            padding: "3px 8px",
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {qf.arrayQuestion.length} câu
                        </span>
                        {qf.rating && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <span
                              style={{
                                color: "#f59e0b",
                                fontSize: "14px",
                              }}
                            >
                              ★
                            </span>
                            <span
                              style={{
                                fontSize: "13px",
                                color: "#6b7280",
                              }}
                            >
                              {qf.rating} ({qf.ratingCount || 1})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f3f4f6",
                        paddingTop: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            backgroundColor: "#e5e7eb",
                          }}
                        >
                          <img
                            src={qf.createdBy?.avatar || "/default-avatar.png"}
                            alt={qf.createdBy?.userName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.svg?height=24&width=24";
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#6b7280",
                            fontWeight: "500",
                          }}
                        >
                          {qf.createdBy?.userName || "Không xác định"}
                        </span>
                      </div>
                      <button
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "#4b5563",
                          border: "none",
                          borderRadius: "6px",
                          padding: "5px 10px",
                          fontSize: "13px",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(qf);
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#e5e7eb";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#f3f4f6";
                        }}
                      >
                        Xem trước
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 20px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    marginBottom: "15px",
                  }}
                >
                  📚
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    margin: 0,
                  }}
                >
                  Không tìm thấy học phần
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        {selectedItem ? (
          <div
            style={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                onClick={() => navigate(`/questionfile/getById/${selectedItem._id}`)}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
              >
                Học
              </button>
            </div>
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: "20px",
              }}
            >
              {selectedItem.arrayQuestion && selectedItem.arrayQuestion.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px",
                  }}
                >
                  {selectedItem.arrayQuestion.map((question, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div style={{ marginBottom: "15px" }}>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            margin: 0,
                            color: "#111827",
                            lineHeight: "1.5",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "600",
                              color: "#4f46e5",
                              marginRight: "8px",
                            }}
                          >
                            QN={index + 1}
                          </span>
                          {question.content}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {question.answers.map((answer, ansIndex) => (
                          <div
                            key={ansIndex}
                            style={{
                              padding: "12px 15px",
                              borderRadius: "8px",
                              backgroundColor: answer.isCorrect ? "#ecfdf5" : "#fff",
                              border: `1px solid ${answer.isCorrect ? "#10b981" : "#e5e7eb"}`,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                              }}
                            >
                              <span
                                style={{
                                  minWidth: "20px",
                                  fontWeight: "500",
                                  color: "#6b7280",
                                }}
                              >
                                {String.fromCharCode(97 + ansIndex)}.
                              </span>
                              <span
                                style={{
                                  fontSize: "15px",
                                  color: answer.isCorrect ? "#047857" : "#374151",
                                  fontWeight: answer.isCorrect ? "500" : "normal",
                                }}
                              >
                                {answer.answerContent}
                              </span>
                            </div>
                            {answer.isCorrect && (
                              <span
                                style={{
                                  color: "#10b981",
                                  fontWeight: "500",
                                  fontSize: "14px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                (Đáp án đúng)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    color: "#6b7280",
                    fontSize: "16px",
                  }}
                >
                  Không có câu hỏi để hiển thị
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundColor: "#f9fafb",
              color: "#6b7280",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>👆</div>
            <p style={{ fontSize: "16px", maxWidth: "300px", margin: "0 auto" }}>
              Chọn một học phần từ danh sách bên trái để xem chi tiết
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionFilesTab;