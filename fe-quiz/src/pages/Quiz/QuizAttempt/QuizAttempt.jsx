import React, { useState, useEffect, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import QuestionComponent from "../QuestionComponent/QuestionComponent";
import "./QuizAttempt.css";

export default function QuizAttempt() {
  const { id: quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const questionRefs = useRef([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:9999/quiz/getQuiz/${quizId}`);
        if (response.ok) {
          const dataRespone = await response.json();
          setQuizData(dataRespone.data);
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

  if (!quizData) return <p>Loading...</p>;

  return (
    <div className="quiz-container">
      {/* Nội dung câu hỏi */}
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
    </div>
  );
}
