"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudySession, submitAnswer, endRound } from "../../../helper/api";
import ProgressBar from "./ProgressBar";
import Question from "./Question";
import RoundSummary from "./RoundSummary";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
    z-index: 0;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #2a4365;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #4299e1, #63b3ed);
    border-radius: 2px;
  }
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  
  @media (min-width: 768px) {
    width: 50%;
  }
`;

const Alert = styled.div`
  padding: 20px;
  border-radius: 12px;
  background-color: ${(props) => (props.variant === "destructive" ? "#fff5f5" : "#f7fafc")};
  border: 1px solid ${(props) => (props.variant === "destructive" ? "#fed7d7" : "#e2e8f0")};
  color: ${(props) => (props.variant === "destructive" ? "#c53030" : "#2d3748")};
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const AlertTitle = styled.h5`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
  color: ${(props) => (props.variant === "destructive" ? "#c53030" : "#2d3748")};
`;

const AlertDescription = styled.p`
  color: ${(props) => (props.variant === "destructive" ? "#c53030" : "#4a5568")};
  font-size: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border-left-color: #4299e1;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: #4a5568;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #4a5568;
  background: rgba(255, 255, 247, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  p {
    font-size: 18px;
    margin-bottom: 0;
  }
`;

export default function StudySession() {
  const { questionFileId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRoundQuestions, setCurrentRoundQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [roundSummary, setRoundSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        console.log("Fetching study session for questionFileId:", questionFileId);
        const data = await getStudySession(questionFileId);
        console.log("Study session data:", JSON.stringify(data, null, 2));
        if (!data.questions || data.questions.length === 0) {
          throw new Error("Không có câu hỏi nào để hiển thị.");
        }
        if (isMounted) {
          setSession(data);
          setCurrentRoundQuestions(data.questions);
          setIsCompleted(data.completed);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching study session:", error);
        if (isMounted) {
          setError(error.message);
          alert(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [questionFileId]);

  const handleSubmitAnswer = async (questionId, selectedAnswers) => {
    try {
      const result = await submitAnswer(questionFileId, questionId, selectedAnswers);
      console.log("Submit answer result:", JSON.stringify(result, null, 2));
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: result.progress || { learnedCount: 0, totalQuestions: prev.totalQuestions, percentage: 0 },
          correctAnswers: result.progress?.learnedCount || 0,
        };
      });
      return result;
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Không thể gửi đáp án. Vui lòng thử lại!");
      throw error;
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 < currentRoundQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      try {
        const summary = await endRound(questionFileId);
        console.log("End round summary:", JSON.stringify(summary, null, 2));
        setRoundSummary(summary);
        setIsCompleted(summary.allQuestionsCompleted);
        setShowSummary(true);
        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            progress: summary.progress,
            correctAnswers: summary.progress.learnedCount,
          };
        });
      } catch (error) {
        console.error("Error ending round:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    }
  };

  const handleRestart = async () => {
    console.log("Handle restart called");
    setIsLoading(true);
    try {
      const data = await getStudySession(questionFileId, true);
      console.log("Data after restart:", JSON.stringify(data, null, 2));
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Không có câu hỏi nào để hiển thị.");
      }
      setSession(data);
      setCurrentRoundQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setShowSummary(false);
      setIsCompleted(false);
      setError(null);
    } catch (error) {
      console.error("Error restarting study session:", error);
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log("Handle back called");
    navigate(`/questionfile/getById/${questionFileId}`);
  };

  const updateCorrectAnswers = () => {};

  if (isLoading) {
    return (
      <PageContainer>
        <Container>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Đang tải dữ liệu...</LoadingText>
          </LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Container>
          <Title>Học</Title>
          <Alert variant="destructive">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Container>
      </PageContainer>
    );
  }

  if (showSummary) {
    return (
      <PageContainer>
        <RoundSummary
          roundSummary={roundSummary}
          onRestart={handleRestart}
          onBack={handleBack}
          isCompleted={isCompleted}
        />
      </PageContainer>
    );
  }

  const currentQuestion = currentRoundQuestions[currentQuestionIndex];

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Học</Title>
          <ProgressContainer>
            <ProgressBar
              correctAnswers={session?.progress?.learnedCount || 0}
              totalQuestions={session?.totalQuestions || 0}
            />
          </ProgressContainer>
        </Header>

        {currentQuestion ? (
          <Question
            question={currentQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
            updateCorrectAnswers={updateCorrectAnswers}
          />
        ) : (
          <EmptyState>
            <p>Không có câu hỏi nào để hiển thị.</p>
          </EmptyState>
        )}
      </Container>
    </PageContainer>
  );
}