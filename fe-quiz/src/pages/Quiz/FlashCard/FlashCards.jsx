import React, { useState, useEffect } from "react";
import CardFlip from "react-card-flip";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Flashcard.css"; // Đảm bảo có file CSS để tùy chỉnh giao diện

const Flashcard = ({ question, answer, isFlipped, setIsFlipped, isTransitioning }) => {
  return (
    <CardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div className={`flashcard front ${isTransitioning ? 'fade-out' : 'fade-in'}`} onClick={() => setIsFlipped(true)}>
        <p>{question}</p>
      </div>
      <div className={`flashcard back ${isTransitioning ? 'fade-out' : 'fade-in'}`} onClick={() => setIsFlipped(false)}>
        <p>{answer}</p>
      </div>
    </CardFlip>
  );
};

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    fetch("http://localhost:9999/questionFile/getById/6728ebc9c0060ccd337b4348")
      .then((response) => response.json())
      .then((data) => {
        // Xử lý dữ liệu từ API để tạo danh sách flashcard
        const processedFlashcards = data.questionFile.arrayQuestion.map((q) => {
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
        });

        setFlashcards(processedFlashcards);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  const nextCard = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevCard = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
      setIsTransitioning(false);
    }, 300);
  };

  if (loading) {
    return <div className="text-center">Đang tải dữ liệu...</div>;
  }

  if (flashcards.length === 0) {
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
        isTransitioning={isTransitioning}
      />
      <button className="btn btn-primary ms-3" onClick={nextCard}>
        {">"}
      </button>
    </div>
  );
};

export default FlashcardList;