"use client";

import { useState, useEffect, useRef } from "react"; // Thêm useRef
import { useParams, useNavigate } from "react-router-dom";
import { getStudySession, submitAnswer, endRound, resetStudySession } from "../../../helper/api";
import ProgressBar from "./ProgressBar";
import Question from "./Question";
import RoundSummary from "./RoundSummary";
import styled from "styled-components";
import { FaCog, FaTimes, FaRedo, FaRandom } from "react-icons/fa";

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    display: none;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  position: relative;
  z-index: 1;
`;

const ContentBlock = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #4299e1;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const FileName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  cursor: pointer;
  text-align: center;

  &:hover {
    color: #4299e1;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: #4299e1;
  }
`;

const SettingsMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 200px;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 15px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #2d3748;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #edf2f7;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }

  svg {
    font-size: 16px;
    color: #4a5568;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
  
  @media (min-width: 768px) {
    width: 100%;
    margin: 0 auto 10px auto;
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
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Thêm ref để tham chiếu đến dropdown và nút setting
  const settingsMenuRef = useRef(null);
  const settingsButtonRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        const data = await getStudySession(questionFileId);
        if (!data.questions || data.questions.length === 0) {
          throw new Error("Không có câu hỏi nào để hiển thị.");
        }
        if (isMounted) {
          setSession(data);
          setCurrentRoundQuestions(data.questions);
          setCurrentQuestionIndex(0);
          setIsCompleted(data.completed);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching study session:", error);
        if (isMounted) {
          setError(error.message);
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

  // Thêm useEffect để xử lý click ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setShowSettingsMenu(false);
      }
    };

    if (showSettingsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettingsMenu]);

  const handleSubmitAnswer = async (questionId, selectedAnswers) => {
    try {
      const result = await submitAnswer(questionFileId, questionId, selectedAnswers);
      setSession((prev) => ({
        ...prev,
        progress: result.progress,
        correctAnswers: result.progress.learnedCount,
      }));
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
        if (!summary || !summary.roundSummary) {
          throw new Error("Invalid round summary data");
        }
        const safeRoundSummary = {
          ...summary.roundSummary,
          questions: Array.isArray(summary.roundSummary.questions) ? summary.roundSummary.questions : [],
        };
        setRoundSummary(safeRoundSummary);
        setIsCompleted(summary.allRoundsCompleted);
        setShowSummary(true);
        setSession((prev) => ({
          ...prev,
          progress: summary.progress,
          correctAnswers: summary.progress.learnedCount,
          currentRound: summary.currentRound,
        }));
      } catch (error) {
        console.error("Error ending round:", error);
        setError("Có lỗi xảy ra khi kết thúc lượt học. Vui lòng thử lại!");
        setShowSummary(false);
      }
    }
  };

  const handleDontKnow = (question) => {
    const updatedQuestions = [...currentRoundQuestions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];
    updatedQuestions.splice(currentQuestionIndex, 1);
    updatedQuestions.push(currentQuestion);
    setCurrentRoundQuestions(updatedQuestions);

    if (currentQuestionIndex >= updatedQuestions.length) {
      handleNextQuestion();
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const data = await getStudySession(questionFileId);
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Không có câu hỏi nào để hiển thị.");
      }
      setSession(data);
      setCurrentRoundQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setShowSummary(false);
      setError(null);
    } catch (error) {
      console.error("Error continuing study session:", error);
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    setIsLoading(true);
    try {
      const data = await resetStudySession(questionFileId);
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Không có câu hỏi nào để hiển thị.");
      }
      setSession(data);
      setCurrentRoundQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setShowSummary(false);
      setIsCompleted(false);
      setError(null);
      setShowSettingsMenu(false);
    } catch (error) {
      console.error("Error restarting study session:", error);
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffleQuestions = () => {
    const allQuestions = [...session.questions];
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    setSession((prev) => ({
      ...prev,
      questions: allQuestions,
    }));

    const QUESTIONS_PER_ROUND = 7;
    const startIndex = (session.currentRound - 1) * QUESTIONS_PER_ROUND;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_ROUND, allQuestions.length);
    const shuffledRoundQuestions = allQuestions.slice(startIndex, endIndex);

    setCurrentRoundQuestions(shuffledRoundQuestions);
    setCurrentQuestionIndex(0);
    setShowSettingsMenu(false);
  };

  const handleBack = () => {
    navigate(`/questionfile/getById/${questionFileId}`);
  };

  const toggleSettingsMenu = () => {
    setShowSettingsMenu((prev) => !prev); // Toggle dropdown
  };

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
          onContinue={!isCompleted ? handleContinue : null}
          onRestart={isCompleted ? handleRestart : null}
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
        <ContentBlock>
          <HeaderContainer>
            <FileName onClick={handleBack}>
              {session?.questionFileName || "Tên bộ câu hỏi"}
            </FileName>
            <IconContainer>
              <IconButton ref={settingsButtonRef} onClick={toggleSettingsMenu}>
                <FaCog />
                {showSettingsMenu && (
                  <SettingsMenu ref={settingsMenuRef}>
                    <MenuItem onClick={handleRestart}>
                      <FaRedo />
                      Học lại từ đầu
                    </MenuItem>
                    <MenuItem onClick={handleShuffleQuestions}>
                      <FaRandom />
                      Trộn câu hỏi
                    </MenuItem>
                  </SettingsMenu>
                )}
              </IconButton>
              <IconButton onClick={handleBack}>
                <FaTimes />
              </IconButton>
            </IconContainer>
          </HeaderContainer>
          <ProgressContainer>
            <ProgressBar
              correctAnswers={session?.progress?.learnedCount || 0}
              totalQuestions={session?.totalQuestions || 0}
            />
          </ProgressContainer>

          {currentQuestion ? (
            <Question
              question={currentQuestion}
              onSubmitAnswer={handleSubmitAnswer}
              onNextQuestion={handleNextQuestion}
              onDontKnow={handleDontKnow}
            />
          ) : (
            <EmptyState>
              <p>Không có câu hỏi nào để hiển thị.</p>
            </EmptyState>
          )}
        </ContentBlock>
      </Container>
    </PageContainer>
  );
}