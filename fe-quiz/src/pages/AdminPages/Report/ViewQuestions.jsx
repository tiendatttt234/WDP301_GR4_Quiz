import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewQuestions.css";

const ViewQuestions = () => {
  const { id } = useParams(); // Lấy questionFileId từ URL
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:9999/questionFile/getById/${id}`)
      .then((response) => {
        const { name, description, arrayQuestion } = response.data.questionFile;
        setTitle(name);
        setDescription(description);
        const formattedQuestions = arrayQuestion.map((q) => ({
          id: q.questionId,
          question: q.content,
          answers: q.answers.map((a) => a.answerContent),
          selectedAnswers: q.answers
            .map((a, index) => (a.isCorrect ? index : null))
            .filter((i) => i !== null),
        }));
        setQuestions(formattedQuestions);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, [id]);

  return (
    <div className="containerView">
      <h1 className="titleView">{title}</h1>
      <div className="description-box">{description}</div>

      <div className="questions-list">
        {questions.map((question, qIndex) => (
          <div className="question-card" key={question.id}>
            <div className="question-header">
              <span className="question-number">Câu {qIndex + 1}:</span>
              <span className="question-content">{question.question}</span>
            </div>
            <ul className="answers-list">
              {question.answers.map((answer, index) => (
                <li
                  key={index}
                  className={`answer-item ${
                    question.selectedAnswers.includes(index) ? "correct" : ""
                  }`}
                >
                  {answer}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button className="back-button" onClick={() => window.history.back()}>
          Trở lại
        </button>
      </div>
    </div>
  );
};

export default ViewQuestions;