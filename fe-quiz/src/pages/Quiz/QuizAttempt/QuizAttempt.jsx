import React, { useState, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import QuestionComponent from "./QuestionComponent";
import "./QuizAttempt.css";

export default function QuizAttempt() {
  const style = {
    card: {
      width: "60%",
      maxWidth: "800px",
      minWidth: "300px",
      margin: "20px 0",
    },
  };

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Giả sử user đã đăng nhập
  const questionRefs = useRef([]); // Để scroll đến câu hỏi

  // 🔹 Dữ liệu giả lập từ API
  const fakeQuizData = {
    id: "672905d4239fb01d9282c84f",
    name: "Bài kiểm tra tiếng Anh",
    duration: 30,
    questionFileId: "6728f9da7b4e82d917838cb6",
    questionFileName: "English Question",
    questions: [
      {
        questId: "6728f9df7b4e82d917838d9e",
        content: "\"She are my friend.\" is a grammatically correct sentence.",
        type: "Boolean",
        answers: [
          { answerId: "6728f9df7b4e82d917838d9f", text: "Đúng" },
          { answerId: "6728f9df7b4e82d917838da0", text: "Sai" },
        ],
      },
      {
        questId: "6728f9df7b4e82d917838d91",
        content: "Which of the following are commonly used prepositions?",
        type: "MAQ",
        answers: [
          { answerId: "6728f9df7b4e82d917838d92", text: "On" },
          { answerId: "6728f9df7b4e82d917838d93", text: "Quickly" },
          { answerId: "6728f9df7b4e82d917838d94", text: "At" },
          { answerId: "6728f9df7b4e82d917838d95", text: "Beautiful" },
        ],
      },
      {
        questId: "6728f9df7b4e82d917838d6e",
        content: "Which of the following is a synonym for \"happy\"?",
        type: "MCQ",
        answers: [
          { answerId: "6728f9df7b4e82d917838d6f", text: "Sad" },
          { answerId: "6728f9df7b4e82d917838d70", text: "Joyful" },
          { answerId: "6728f9df7b4e82d917838d71", text: "Angry" },
          { answerId: "6728f9df7b4e82d917838d72", text: "Disappointed" },
        ],
      },
    ],
  };

  const [quizData] = useState(fakeQuizData);
  const [userAnswers, setUserAnswers] = useState([]);

  // 🔹 Xử lý chọn đáp án
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

  // 🔹 Xử lý nộp bài
  const handleSubmit = () => {
    const submissionData = {
      userId,
      quizId: quizData.id,
      questionFileId: quizData.questionFileId,
      userAnswers: quizData.questions.map((quizItem, index) => ({
        questionId: quizItem.questId,
        selectedAnswerId: Array.isArray(userAnswers[index])
          ? userAnswers[index]
          : [userAnswers[index]],
      })),
    };

    console.log("Dữ liệu nộp bài:", submissionData);
    navigate("/user/quiz-result", { state: { results: submissionData } });
  };

  return (
    <div className="d-flex">
      <div className="side-nav p-3">
        <ul className="list-unstyled">
          {quizData.questions.map((_, index) => (
            <li key={index} className="my-2">
              <Button
                variant="outline-primary"
                onClick={() => questionRefs.current[index].scrollIntoView({ behavior: "smooth" })}
              >
                {index + 1}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="quiz-content flex-grow-1 p-3">
        {quizData.questions.map((quizItem, index) => (
          <Card
            key={quizItem.questId}
            ref={(el) => (questionRefs.current[index] = el)}
            id={`question-${index}`}
            className="mb-3"
            style={style.card}
          >
            <Card.Header className="questionCard">
              <h5>{quizItem.content}</h5>
            </Card.Header>
            <Card.Body>
              <Card.Title>
                {quizItem.type === "MAQ" ? "Chọn nhiều đáp án" : "Chọn một đáp án"}
              </Card.Title>

              <QuestionComponent
                quizItem={quizItem}
                userAnswer={userAnswers[index]}
                index={index}
                handleAnswerSelect={handleAnswerSelect}
              />
            </Card.Body>
          </Card>
        ))}
        <div className="text-center">
          <Button variant="primary" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
