import styled from "styled-components";

const SummaryContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SummaryTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #2a4365;
  text-align: center;
  margin-bottom: 20px;
`;

const QuestionList = styled.div`
  margin-bottom: 30px;
`;

const QuestionItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const QuestionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const QuestionText = styled.div`
  font-size: 16px;
  color: #2d3748;
  margin-bottom: 8px;
`;

const CorrectAnswer = styled.div`
  font-size: 14px;
  color: #4a5568;
  font-style: italic;
  margin-bottom: 8px;
`;

const StatusText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.isCorrect ? "#48bb78" : "#f56565")};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const RestartButton = styled.button`
  padding: 12px 24px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: #38a169;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(72, 187, 120, 0.4);
  }
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(245, 101, 101, 0.4);
  }
`;

const RoundSummary = ({
  roundSummary = {},
  onRestart = () => { },
  onBack = () => { },
  isCompleted = false,
}) => {
  // Debug để kiểm tra props
  console.log("RoundSummary props:", {
    roundSummary,
    onRestart,
    onBack,
    isCompleted,
  });

  // Đảm bảo roundSummary có thuộc tính questions
  const questions = roundSummary?.roundSummary?.questions || [];

  return (
    <SummaryContainer>
      <SummaryTitle>Chúc mừng! Bạn đã hoàn thành tất cả câu hỏi.</SummaryTitle>
      <QuestionList>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <QuestionItem key={index}>
              <QuestionContent>
                <QuestionText>
                  {index + 1}. {question.content}
                </QuestionText>
                <CorrectAnswer>
                  Đáp án đúng: {question.correctAnswers.join(", ")}
                </CorrectAnswer>
                {/* <StatusText isCorrect={question.isLearned}>
                  {question.isLearned ? "Đúng" : "Sai"}
                </StatusText> */}
              </QuestionContent>
            </QuestionItem>
          ))
        ) : (
          <p>Không có câu hỏi nào để hiển thị.</p>
        )}
      </QuestionList>
      <ButtonContainer>
        <RestartButton onClick={onRestart}>Học lại</RestartButton>
        <BackButton onClick={onBack}>Trở về</BackButton>
      </ButtonContainer>
    </SummaryContainer>
  );
};

export default RoundSummary;