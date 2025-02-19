import React, { useState } from "react";
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
  const flashcards = [
    { question: "React là gì?", answer: "Một thư viện JavaScript để xây dựng giao diện người dùng" },
    { question: "JSX là gì?", answer: "Một cú pháp mở rộng cho JavaScript, sử dụng trong React" },
    { question: "useState dùng để làm gì?", answer: "Quản lý trạng thái trong functional component" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
    <div className="flashcard-container d-flex align-items-center justify-content-center">
      <button className="btn btn-primary me-3" onClick={prevCard}>&lt;</button>
      <Flashcard 
        question={flashcards[currentIndex].question} 
        answer={flashcards[currentIndex].answer} 
        isFlipped={isFlipped} 
        setIsFlipped={setIsFlipped} 
        isTransitioning={isTransitioning}
      />
      <button className="btn btn-primary ms-3" onClick={nextCard}>&gt;</button>
    </div>
  );
};

export default FlashcardList;
