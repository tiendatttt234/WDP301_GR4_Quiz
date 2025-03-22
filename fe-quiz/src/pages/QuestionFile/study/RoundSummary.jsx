import styled from "styled-components";

const SummaryWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;

const SummaryTitle = styled.h2`
  font-size: 24px;
  color: #2d3748;
  margin-bottom: 20px;
`;

const SummaryStats = styled.div`
  margin-bottom: 20px;
`;

const StatItem = styled.p`
  font-size: 16px;
  color: #4a5568;
  margin: 8px 0;
`;

const QuestionList = styled.div`
  margin-bottom: 20px;
`;

const QuestionItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
`;

const QuestionContent = styled.p`
  font-size: 16px;
  color: #2d3748;
  margin-bottom: 8px;
`;

const CorrectAnswer = styled.p`
  font-size: 14px;
  color: #48bb78;
`;

const WrongAttempts = styled.p`
  font-size: 14px;
  color: #c53030;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: ${(props) => (props.primary ? "#4299e1" : "transparent")};
  border: 1px solid #4299e1;
  color: ${(props) => (props.primary ? "#ffffff" : "#4299e1")};
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.primary ? "#3182ce" : "#4299e1")};
    color: #ffffff;
  }
`;

const RoundSummary = ({ roundSummary, onContinue, onRestart, onBack, isCompleted }) => {
  return (
    <SummaryWrapper>
      <SummaryTitle>Kết quả lượt {roundSummary.roundNumber}</SummaryTitle>
      <SummaryStats>
        <StatItem>Số câu đúng: {roundSummary.correctCount}/{roundSummary.totalInRound}</StatItem>
      </SummaryStats>
      <QuestionList>
        {roundSummary.questions.map((q, index) => (
          <QuestionItem key={index}>
            <QuestionContent>{q.content}</QuestionContent>
            <CorrectAnswer>Đáp án đúng: {q.correctAnswers.join(", ")}</CorrectAnswer>
            <WrongAttempts>Số lần sai: {q.wrongAttempts}</WrongAttempts>
          </QuestionItem>
        ))}
      </QuestionList>
      <ButtonGroup>
        {!isCompleted && (
          <ActionButton primary onClick={onContinue}>
            Tiếp tục
          </ActionButton>
        )}
        {isCompleted && onRestart && (
          <ActionButton primary onClick={onRestart}>
            Học lại
          </ActionButton>
        )}
        <ActionButton onClick={onBack}>
          Trở về
        </ActionButton>
      </ButtonGroup>
    </SummaryWrapper>
  );
};

export default RoundSummary;