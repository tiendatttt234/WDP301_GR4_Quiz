"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const QuestionFileByUser = () => {
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [questionFiles, setQuestionFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchQuestionFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/questionFile/user/${userId}`
        );
        setQuestionFiles(response.data.data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionFiles();
  }, [userId]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  const groupedFiles = questionFiles.reduce((acc, file) => {
    const date = new Date(file.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${month}-${year}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(file);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredGroups = Object.keys(groupedFiles).reduce((acc, key) => {
    const filteredFiles = groupedFiles[key].filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredFiles.length > 0) acc[key] = filteredFiles;
    return acc;
  }, {});

  const handleQuestionClick = (id) => {
    navigate(`/questionfile/getById/${id}`);
  };

  // Lấy username từ questionFiles (nếu có dữ liệu)
  const username = questionFiles.length > 0 ? questionFiles[0].createdBy.userName : "Người dùng";

  const styles = {
    container: { minHeight: "100vh", background: "white" },
    header: {
      padding: "16px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
    },
    logoCircle: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      background: "#99f6e4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "16px",
    },
    title: { fontSize: "24px", fontWeight: "bold", color: "#333" },
    subtitle: { color: "#666" },
    main: { maxWidth: "1280px", margin: "0 auto", padding: "24px" },
    searchContainer: {
      position: "relative",
      marginBottom: "32px",
      width: "50%",
    },
    searchInput: {
      width: "100%",
      padding: "8px 32px 8px 8px",
      border: "1px solid #eee",
      borderRadius: "4px",
      outline: "none",
      fontSize: "14px",
    },
    searchIcon: {
      position: "absolute",
      right: "8px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#999",
      width: "16px",
      height: "16px",
    },
    section: { marginBottom: "32px" },
    sectionTitle: { fontSize: "14px", color: "#666", marginBottom: "16px" },
    card: {
      border: "1px solid #eee",
      borderRadius: "6px",
      padding: "20px",
      marginBottom: "12px",
      cursor: "pointer",
      transition: "box-shadow 0.2s ease",
    },
    cardHover: {
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    cardSubtitle: { fontSize: "14px", color: "#666" },
    cardTitle: { fontSize: "18px", fontWeight: "500", marginTop: "4px" },
    notFound: {
      color: "#666",
      textAlign: "center",
      padding: "20px",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoCircle}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="2"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </div>
        <div>
          <h1 style={styles.title}>{username}</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm tệp câu hỏi"
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            style={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {Object.keys(filteredGroups).length === 0 && searchQuery ? (
          <p style={styles.notFound}>
            Không tìm thấy học phần phù hợp với "{searchQuery}"
          </p>
        ) : (
          Object.keys(filteredGroups)
            .sort((a, b) => {
              const [monthA, yearA] = a.split("-").map(Number);
              const [monthB, yearB] = b.split("-").map(Number);
              return yearB - yearA || monthB - monthA;
            })
            .map((key) => {
              const [month, year] = key.split("-");
              return (
                <section key={key} style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    THÁNG {month} NĂM {year}
                  </h2>
                  {filteredGroups[key].map((file) => (
                    <Link
                      to={`/questionfile/getById/${file._id}`}
                      style={{ textDecoration: "none" }}
                      key={file._id}
                    >
                      <div
                        style={styles.card}
                        onClick={() => handleQuestionClick(file._id)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.boxShadow =
                            styles.cardHover.boxShadow)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.boxShadow = "none")
                        }
                      >
                        <div style={styles.cardSubtitle}>
                          {file.arrayQuestion.length} câu hỏi -{" "}
                          {formatDate(file.createdAt)}
                        </div>
                        <div style={styles.cardTitle}>{file.name}</div>
                      </div>
                    </Link>
                  ))}
                </section>
              );
            })
        )}
      </main>
    </div>
  );
};

export default QuestionFileByUser;