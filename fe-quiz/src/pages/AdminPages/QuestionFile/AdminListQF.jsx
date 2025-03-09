import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminListQF.css"; // Import custom CSS file

const AdminListQF = () => {
  const [questionFiles, setQuestionFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch data from the API
  useEffect(() => {
    const fetchQuestionFiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:9999/questionFile/getQFadmin"
        );
        console.log(response.data);
        
        if (response.data.success) {
          setQuestionFiles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching question files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionFiles();
  }, []);

  const viewQuestionFileReported = async (qfId) => {
    try {
      // Điều hướng sang trang ViewQuestion với questionFileId
      navigate(`/admin/view-question-detail/${qfId}`);
    } catch (error) {
      alert("Lỗi khi lấy dữ liệu bộ câu hỏi bị báo cáo");
    }
  };

  return (
    <div className="admin-qf-container">
      <h1>Admin Question Files List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="qf-table">
          <thead>
            <tr>
              <th>QF Name</th>
              <th>User Name</th>
              <th>Private</th>
              <th>Reported</th>
              <th>Reported Count</th>
              <th>Locked</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questionFiles.map((qf) => (
              <tr key={qf.id}>
                <td>{qf.name}</td>
                <td>{qf.userName}</td>
                <td>
                  <span
                    className={`status-tag ${
                      qf.isPrivate ? "private" : "public"
                    }`}
                  >
                    {qf.isPrivate ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-tag ${
                      qf.isReported ? "reported" : "not-reported"
                    }`}
                  >
                    {qf.isReported ? "Yes" : "No"}
                  </span>
                </td>
                <td style={{textAlign:"center"}}>{qf.reportedCount}</td>
                <td>
                  <span
                    className={`status-tag ${
                      qf.isLocked ? "locked" : "not-locked"
                    }`}
                  >
                    {qf.isLocked ? "Yes" : "No"}
                  </span>
                </td>
                <td>{new Date(qf.createdAt).toLocaleString()}</td>
                <td>{new Date(qf.updatedAt).toLocaleString()}</td>
                <td>
                  <button
                    className="action-btn view"
                    onClick={() => viewQuestionFileReported(qf.id)}
                  >
                    File Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminListQF;
