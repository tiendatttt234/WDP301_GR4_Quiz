"use client"

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (userId && !shouldFetch) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const fetchData = async () => {
    if (!userId) {
      toast.error("ID người dùng không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:9999/search/users/${userId}`, {
        params: {
          searchKeyword: searchKeyword ? searchKeyword.trim() : undefined,
        },
      });

      if (response.data.success) {
        setData(response.data);
      } else {
        toast.warn(response.data.message || "Không tìm thấy người dùng!", {
          position: "top-right",
          autoClose: 2000,
        });
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi lấy thông tin người dùng!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = () => {
    const MIN_KEYWORD_LENGTH = 2;
    if (searchKeyword && searchKeyword.trim().length < MIN_KEYWORD_LENGTH) {
      toast.error(`Từ khóa tìm kiếm phải có ít nhất ${MIN_KEYWORD_LENGTH} ký tự!`, {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    setShouldFetch(true);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f4f6",
            borderTopColor: "#4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 0",
          textAlign: "center",
          height: "70vh",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            marginBottom: "20px",
          }}
        >
          👤
        </div>
        <p
          style={{
            fontSize: "18px",
            color: "#6b7280",
            margin: "0",
          }}
        >
          Không tìm thấy người dùng
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
          marginBottom: "40px",
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #f3f4f6",
          }}
        >
          {data.user.avatar ? (
            <img
              src={data.user.avatar || "/placeholder.svg"}
              alt={data.user.userName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.svg?height=120&width=120";
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
                backgroundColor: "#4f46e5",
                color: "white",
                fontSize: "48px",
                fontWeight: "bold",
              }}
            >
              {data.user.userName ? data.user.userName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#111827",
              margin: "0 0 10px 0",
            }}
          >
            {data.user.userName}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f3f4f6",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "15px",
                color: "#4b5563",
                fontWeight: "500",
              }}
            >
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          marginBottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6b7280",
            fontSize: "18px",
          }}
        >
          🔍
        </div>
        <input
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Tìm kiếm tất cả học phần"
          style={{
            width: "100%",
            padding: "16px 16px 16px 48px",
            fontSize: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
        >
          Tìm kiếm
        </button>
      </div>

      {Object.keys(data.questionFiles).length > 0 ? (
        Object.keys(data.questionFiles).map((monthYear) => (
          <div
            key={monthYear}
            style={{
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                }}
              >
                📅
              </span>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0",
                }}
              >
                {monthYear}
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {data.questionFiles[monthYear].map((qf) => (
                <div
                  key={qf._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/questionfile/getById/${qf._id}`)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                    }}
                  >
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
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
                            src={data.user.avatar || "/placeholder.svg?height=32&width=32"}
                            alt="Author Avatar"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.svg?height=32&width=32";
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
                            {data.user.userName}
                          </span>
                        </div>
                      </div>
                      <button
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/questionfile/getById/${qf._id}`);
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
                      >
                        Học
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0",
            textAlign: "center",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              marginBottom: "20px",
            }}
          >
            📚
          </div>
          <p
            style={{
              fontSize: "18px",
              color: "#6b7280",
              margin: "0 0 10px 0",
            }}
          >
            Không tìm thấy học phần phù hợp với từ khóa "{searchKeyword}"
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#9ca3af",
              maxWidth: "500px",
              margin: "0",
            }}
          >
            Hãy thử tìm kiếm với từ khóa khác hoặc xem tất cả học phần của người dùng này
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;