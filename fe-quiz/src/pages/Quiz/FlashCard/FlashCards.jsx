import React, { useState } from "react";
import CardFlip from "react-card-flip";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Flashcard.css";

const Flashcard = ({ question, answer, isFlipped, setIsFlipped, direction, isTransitioning }) => {
  return (
    <CardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div
        className={`flashcard front ${
          isTransitioning
            ? direction === "next"
              ? "slide-out-left"
              : "slide-out-right"
            : direction === "next"
            ? "slide-in-right"
            : "slide-in-left"
        }`}
        onClick={() => setIsFlipped(true)}
      >
        <p>{question}</p>
      </div>
      <div
        className={`flashcard back ${
          isTransitioning
            ? direction === "next"
              ? "slide-out-left"
              : "slide-out-right"
            : direction === "next"
            ? "slide-in-right"
            : "slide-in-left"
        }`}
        onClick={() => setIsFlipped(false)}
      >
        <p>{answer}</p>
      </div>
    </CardFlip>
  );
};

const FlashcardList = ({ questionFile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next"); // Theo dõi hướng trượt

  // Xử lý dữ liệu từ questionFile để tạo danh sách flashcard
  const flashcards = questionFile
    ? questionFile.arrayQuestion.map((q) => {
        let answerText = "";
        if (q.type === "MCQ" || q.type === "Boolean") {
          const correctAnswer = q.answers.find((a) => a.isCorrect);
          answerText = correctAnswer ? correctAnswer.answerContent : "Không có đáp án đúng";
        } else if (q.type === "MAQ") {
          const correctAnswers = q.answers
            .filter((a) => a.isCorrect)
            .map((a) => a.answerContent)
            .join(", ");
          answerText = correctAnswers || "Không có đáp án đúng";
        }
        return {
          question: q.content,
          answer: answerText,
        };
      })
    : [];

  const nextCard = () => {
    if (flashcards.length === 0) return;

    setDirection("next");
    setIsTransitioning(true);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      setIsTransitioning(false);
    }, 400); // Đồng bộ với thời gian transition 0.4s
  };

  const prevCard = () => {
    if (flashcards.length === 0) return;

    setDirection("prev");
    setIsTransitioning(true);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
      setIsTransitioning(false);
    }, 400);
  };

  if (!questionFile || flashcards.length === 0) {
    return <div className="text-center">Không có dữ liệu để hiển thị</div>;
  }

  return (
    <div className="flashcard-container d-flex align-items-center justify-content-center">
      <button className="btn btn-primary me-3" onClick={prevCard}>
        {"<"}
      </button>
      <Flashcard
        question={flashcards[currentIndex].question}
        answer={flashcards[currentIndex].answer}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        direction={direction}
        isTransitioning={isTransitioning}
      />
      <button className="btn btn-primary ms-3" onClick={nextCard}>
        {">"}
      </button>
    </div>
  );
};

export default FlashcardList;