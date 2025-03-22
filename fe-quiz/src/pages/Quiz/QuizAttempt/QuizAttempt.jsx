import React, { useState, useEffect, useRef } from "react";
import { Card, Container, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import QuestionComponent from "../QuestionComponent/QuestionComponent";
import "./QuizAttempt.css";

export default function QuizAttempt() {
  const { id: quizId } = useParams();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const questionRefs = useRef([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:9999/quiz/getQuiz/${quizId}`);
        if (response.ok) {
          const dataResponse = await response.json();
          setQuizData(dataResponse.data);
        } else {
          console.error("Failed to fetch quiz data");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleAnswerSelect = (questionIndex, answerId) => {
    setUserAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionIndex] || [];

      if (quizData.questions[questionIndex].type === "MAQ") {
        if (currentAnswers.includes(answerId)) {
          return {
            ...prevAnswers,
            [questionIndex]: currentAnswers.filter((id) => id !== answerId),
          };
        } else {
          return {
            ...prevAnswers,
            [questionIndex]: [...currentAnswers, answerId],
          };
        }
      }

      return {
        ...prevAnswers,
        [questionIndex]: answerId,
      };
    });
  };

  const handleSubmit = async () => {
    const submissionData = {
      quizId: quizId,
      answers: quizData.questions.map((question, index) => ({
        questId: question.questId,
        selectedAnswerIds: userAnswers[index] || (question.type === "MAQ" ? [] : null),
      })),
    };
    // console.log(submissionData);
    
    try {
      const response = await fetch("http://localhost:9999/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Quiz result:", result);
        
        // Navigate đến trang kết quả và truyền dữ liệu qua state
        // navigate("/quiz/result", {
        //   state: {
        //     quizResult: result,
        //     quizData: quizData, 
        //     userAnswers: userAnswers, 
        //   },
        // });
      } else {
        console.error("Failed to submit quiz");
        alert("Gửi bài thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Đã xảy ra lỗi khi gửi bài!");
    }
  };

  if (!quizData) return <p>Loading...</p>;

  return (
    <Container>
      <div className="quiz-container">
        <div className="questions">
          {quizData.questions.map((quizItem, index) => (
            <Card
              key={quizItem.questId}
              ref={(el) => (questionRefs.current[index] = el)}
              className="question-card"
            >
              <Card.Header>
                <h5>{quizItem.content}</h5>
              </Card.Header>
              <Card.Body>
                <p>{quizItem.type === "MAQ" ? "Chọn nhiều đáp án" : "Chọn một đáp án"}</p>
                <QuestionComponent
                  quizItem={quizItem}
                  userAnswer={userAnswers[index]}
                  index={index}
                  handleAnswerSelect={handleAnswerSelect}
                />
              </Card.Body>
            </Card>
          ))}
        </div>
        <div className="submit-section">
          <Button variant="primary" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </div>
      </div>
    </Container>
  );
}