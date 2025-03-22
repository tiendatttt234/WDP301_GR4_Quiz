import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./QuizResult.css";

export default function QuizResult() {
  const { state } = useLocation(); // Lấy dữ liệu từ state
  const navigate = useNavigate();
  const { quizResult, quizData, userAnswers } = state || {};

  if (!quizResult || !quizData || !userAnswers) {
    return <p>Không có dữ liệu kết quả để hiển thị!</p>;
  }

  return (
    <Container>
      <div className="result-container">
        <h2>Kết quả bài kiểm tra</h2>
        <p>
          Bạn đã làm đúng {quizResult.correctCount} trên {quizData.questions.length} câu.
        </p>

        <div className="result-details">
          {quizData.questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isMAQ = question.type === "MAQ";
            const selectedAnswers = isMAQ
              ? (userAnswer || []).map((id) =>
                  question.answers.find((ans) => ans.answerId === id)?.text
                )
              : question.answers.find((ans) => ans.answerId === userAnswer)?.text || "Không chọn";

            return (
              <Card key={question.questId} className="result-card">
                <Card.Header>
                  <h5>{question.content}</h5>
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Câu trả lời của bạn:</strong>{" "}
                    {isMAQ ? selectedAnswers.join(", ") : selectedAnswers}
                  </p>
                  {/* Nếu API trả về đáp án đúng, bạn có thể thêm vào đây */}
                </Card.Body>
              </Card>
            );
          })}
        </div>

        <div className="back-button">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    </Container>
  );
}