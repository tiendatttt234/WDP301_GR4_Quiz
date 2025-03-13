// QuizCreationModal.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";


Modal.setAppElement("#root");

const QuizCreationModal = ({ isOpen, onRequestClose, questionFileId }) => {
  const [quizName, setQuizName] = useState("");
  const [questionCount, setQuestionCount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("id");
      // console.log(userId + " " + quizName + " " + questionCount + " " + questionFileId);
      
      if (!userId) {
        toast.error("Vui lòng đăng nhập để tạo bài quiz");
        return;
      }

      const quizData = {
        name: quizName,
        questionCount: parseInt(questionCount),
        questionFileId: questionFileId,
        user: userId,
      };

      const response = await axios.post(
        "http://localhost:9999/quiz/create",
        quizData
      );

      toast.success("Tạo bài quiz thành công!");
      onRequestClose();
      setQuizName("");
      setQuestionCount("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error("Lỗi khi tạo bài quiz: " + errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "450px",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#ffffff",
          border: "none",
          maxHeight: "80vh",
          overflowY: "auto",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: "1000",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2c3e50",
            margin: "0",
          }}
        >
          Tạo bài quiz
        </h2>
        <button
          onClick={onRequestClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            color: "#7f8c8d",
            cursor: "pointer",
            padding: "0",
            lineHeight: "1",
          }}
          onMouseOver={(e) => (e.target.style.color = "#e74c3c")}
          onMouseOut={(e) => (e.target.style.color = "#7f8c8d")}
        >
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "500",
              color: "#34495e",
              marginBottom: "8px",
            }}
          >
            Tên bài quiz:
          </label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #bdc3c7",
              backgroundColor: "#f9fbfc",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
            onFocus={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#3498db",
                boxShadow: "0 0 5px rgba(52, 152, 219, 0.3)",
              })
            }
            onBlur={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#bdc3c7",
                boxShadow: "none",
              })
            }
          />
        </div>
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "500",
              color: "#34495e",
              marginBottom: "8px",
            }}
          >
            Số lượng câu hỏi:
          </label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            min="1"
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #bdc3c7",
              backgroundColor: "#f9fbfc",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
            onFocus={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#3498db",
                boxShadow: "0 0 5px rgba(52, 152, 219, 0.3)",
              })
            }
            onBlur={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#bdc3c7",
                boxShadow: "none",
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <button
            type="submit"
            style={{
              flex: "1",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#ffffff",
              backgroundColor: "#3498db",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s, transform 0.2s",
            }}
            onMouseOver={(e) =>
              Object.assign(e.target.style, {
                backgroundColor: "#2980b9",
                transform: "scale(1.02)",
              })
            }
            onMouseOut={(e) =>
              Object.assign(e.target.style, {
                backgroundColor: "#3498db",
                transform: "scale(1)",
              })
            }
          >
            Tạo
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            style={{
              flex: "1",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#7f8c8d",
              backgroundColor: "#ecf0f1",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s, transform 0.2s",
            }}
            onMouseOver={(e) =>
              Object.assign(e.target.style, {
                backgroundColor: "#dfe6e9",
                transform: "scale(1.02)",
              })
            }
            onMouseOut={(e) =>
              Object.assign(e.target.style, {
                backgroundColor: "#ecf0f1",
                transform: "scale(1)",
              })
            }
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuizCreationModal;