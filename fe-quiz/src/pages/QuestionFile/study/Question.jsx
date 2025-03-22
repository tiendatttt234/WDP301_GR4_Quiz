"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

const QuestionContainer = styled.div`
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(to bottom, #4299e1, #63b3ed);
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
`;

const QuestionText = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2d3748;
  padding-left: 10px;
`;

const QuestionType = styled.div`
  font-size: 14px;
  color: #718096;
  margin-bottom: 15px;
  padding-left: 10px;
  font-weight: 500;
`;

const OptionsContainer = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const Option = styled.div`
  display: block;
  padding: 15px 20px;
  border: 2px solid ${(props) => {
    if (!props.$submitted && !props.$showCorrectAnswer) return "#e2e8f0";
    if (props.$selected) {
      return props.$isCorrect ? "#48bb78" : "#f56565";
    }
    if (props.$showCorrectAnswer && props.$isCorrect) {
      return "#48bb78";
    }
    return "#e2e8f0";
  }};
  border-radius: 10px;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  background-color: ${(props) => {
    if (!props.$submitted && !props.$showCorrectAnswer) return "rgba(255, 255, 255, 0.7)";
    if (props.$selected) {
      return props.$isCorrect ? "rgba(198, 246, 213, 0.7)" : "rgba(254, 215, 215, 0.7)";
    }
    if (props.$showCorrectAnswer && props.$isCorrect) {
      return "rgba(198, 246, 213, 0.7)";
    }
    return "rgba(255, 255, 255, 0.7)";
  }};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${(props) => (props.$disabled ? "inherit" : "rgba(237, 242, 247, 0.8)")};
    transform: ${(props) => (props.$disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) => (props.$disabled ? "none" : "0 4px 6px rgba(0, 0, 0, 0.05)")};
  }
`;

const OptionContent = styled.span`
  font-size: 16px;
  color: #4a5568;
  font-weight: ${(props) => (props.$selected ? "600" : "normal")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .option-indicator {
    margin-right: 12px;
    font-size: 20px;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => (props.$submitted || props.$showCorrectAnswer ? (props.$isCorrect ? "#48bb78" : "#f56565") : "#4a5568")};
  }
`;

const IconContainer = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${(props) => (props.isCorrect ? "rgba(72, 187, 120, 0.2)" : "rgba(245, 101, 101, 0.2)")};
  color: ${(props) => (props.isCorrect ? "#48bb78" : "#f56565")};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: white;
  color: #4299e1;
  border: 2px solid #4299e1;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.1);
  
  &:hover {
    background: #4299e1;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(66, 153, 225, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DontKnowButton = styled.button`
  padding: 12px 24px;
  background: white;
  color: #4299e1;
  border: 2px solid #4299e1;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.1);
  
  &:hover {
    background: #4299e1;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(66, 153, 225, 0.2);
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: ${(props) => (props.isCorrect ? "rgba(198, 246, 213, 0.7)" : "rgba(254, 215, 215, 0.7)")};
  border: 2px solid ${(props) => (props.isCorrect ? "#48bb78" : "#f56565")};
  color: ${(props) => (props.isCorrect ? "#276749" : "#c53030")};
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  
  &::before {
    content: ${(props) => (props.isCorrect ? '"✓"' : '"✗"')};
    font-size: 20px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: ${(props) => (props.isCorrect ? "rgba(72, 187, 120, 0.2)" : "rgba(245, 101, 101, 0.2)")};
  }
`;

const SelectedAnswersPreview = styled.div`
  margin-top: 15px;
  padding: 10px 15px;
  background-color: rgba(237, 242, 247, 0.7);
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
  
  strong {
    color: #2d3748;
    font-weight: 600;
  }
`;

const CheckIcon = () => <IconContainer isCorrect={true}>✓</IconContainer>;
const XIcon = () => <IconContainer isCorrect={false}>✗</IconContainer>;

const Question = ({ question, onSubmitAnswer, onNextQuestion }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const correctAnswerCount = question.answers.filter((answer) => answer.isCorrect).length;
  const isMAQ = question.type === "MAQ" && correctAnswerCount >= 2;
  const isMCQ = question.type === "MCQ" || (question.type === "MAQ" && correctAnswerCount === 1);

  const handleSelectAnswer = async (answer) => {
    if (result && result.isCorrect) return;
    if (showCorrectAnswer) return;

    let newSelectedAnswers;

    if (isMAQ) {
      if (selectedAnswers.includes(answer.answerContent)) {
        newSelectedAnswers = selectedAnswers.filter((a) => a !== answer.answerContent);
      } else {
        newSelectedAnswers = [...selectedAnswers, answer.answerContent];
      }
      setSelectedAnswers(newSelectedAnswers);
    } else {
      newSelectedAnswers = [answer.answerContent];
      setSelectedAnswers(newSelectedAnswers);

      setSubmitted(true);
      try {
        const response = await onSubmitAnswer(question.questionId, newSelectedAnswers);
        setResult(response);

        if (response.isCorrect) {
          setTimeout(() => {
            onNextQuestion();
            resetQuestion();
          }, 1500);
        } else {
          setTimeout(() => {
            resetQuestion();
          }, 1000);
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    setSubmitted(true);
    try {
      const response = await onSubmitAnswer(question.questionId, selectedAnswers);
      setResult(response);

      if (response.isCorrect) {
        setTimeout(() => {
          onNextQuestion();
          resetQuestion();
        }, 1500);
      } else {
        setTimeout(() => {
          resetQuestion();
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleDontKnow = () => {
    setShowCorrectAnswer(true);
    setSubmitted(true);
    setTimeout(() => {
      onNextQuestion();
      resetQuestion();
    }, 1500);
  };

  const resetQuestion = () => {
    setSelectedAnswers([]);
    setResult(null);
    setShowCorrectAnswer(false);
    setSubmitted(false);
  };

  return (
    <QuestionContainer>
      <QuestionText>{question.content}</QuestionText>
      {isMAQ && <QuestionType>Câu hỏi nhiều đáp án</QuestionType>}
      {isMCQ && <QuestionType>Chọn đáp án đúng nhất</QuestionType>}

      <OptionsContainer>
        {question.answers.map((answer) => {
          const isSelected = selectedAnswers.includes(answer.answerContent);

          return (
            <Option
              key={answer.answerId}
              $selected={isSelected}
              $isCorrect={answer.isCorrect}
              $showCorrectAnswer={showCorrectAnswer}
              $disabled={(result && result.isCorrect) || showCorrectAnswer}
              $submitted={submitted}
              onClick={() => handleSelectAnswer(answer)}
            >
              <OptionContent $selected={isSelected} $submitted={submitted} $showCorrectAnswer={showCorrectAnswer} $isCorrect={answer.isCorrect}>
                <span className="option-indicator">
                  {isMAQ ? (isSelected ? "☑" : "☐") : isSelected ? "⦿" : "○"}
                </span>
                {answer.answerContent}
                {(submitted || showCorrectAnswer) && answer.isCorrect && <CheckIcon />}
                {(submitted || showCorrectAnswer) && isSelected && !answer.isCorrect && <XIcon />}
              </OptionContent>
            </Option>
          );
        })}
      </OptionsContainer>

      {isMAQ && selectedAnswers.length > 0 && !result && !showCorrectAnswer && (
        <SelectedAnswersPreview>
          <strong>Đáp án đã chọn:</strong> {selectedAnswers.join(", ")}
        </SelectedAnswersPreview>
      )}

      <ButtonContainer>
        {isMAQ && !result && !showCorrectAnswer && (
          <Button onClick={handleSubmitAnswer} disabled={selectedAnswers.length === 0}>
            Gửi đáp án
          </Button>
        )}
        {!result && !showCorrectAnswer && (
          <DontKnowButton onClick={handleDontKnow}>
            Tôi không biết?
          </DontKnowButton>
        )}
      </ButtonContainer>

      {result && (
        <ResultContainer isCorrect={result.isCorrect}>
          {result.isCorrect ? "Đúng rồi! Chuyển câu tiếp theo..." : "Sai rồi!"}
        </ResultContainer>
      )}
    </QuestionContainer>
  );
};

export default Question;