import styled from "styled-components";

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ProgressNumber = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #4a5568;
  background: #e2e8f0;
  border-radius: 12px;
  padding: 4px 8px;
  min-width: 24px;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  position: relative;
  margin: 0 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #48bb78;
  width: ${(props) => props.percentage}%;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
`;

const ProgressBar = ({ correctAnswers, totalQuestions }) => {
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return (
    <ProgressWrapper>
      <ProgressNumber>{correctAnswers}</ProgressNumber>
      <ProgressBarContainer>
        <ProgressFill percentage={percentage} />
      </ProgressBarContainer>
      <ProgressNumber>{totalQuestions}</ProgressNumber>
    </ProgressWrapper>
  );
};

export default ProgressBar;