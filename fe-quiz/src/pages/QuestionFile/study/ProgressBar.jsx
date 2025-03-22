import styled from "styled-components";

const ProgressContainer = styled.div`
  margin: 10px 0;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  background-color: rgba(226, 232, 240, 0.6);
  border-radius: 10px;
  height: 10px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div`
  width: ${(props) => props.progress}%;
  background: linear-gradient(to right, #48bb78, #68d391);
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
`;

const ProgressBar = ({ correctAnswers, totalQuestions }) => {
  const progress = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return (
    <ProgressContainer>
      <ProgressText>
        <span>Đúng {correctAnswers}</span>
        <span>Tổng số câu hỏi {totalQuestions}</span>
      </ProgressText>
      <ProgressBarWrapper>
        <ProgressFill progress={progress} />
      </ProgressBarWrapper>
    </ProgressContainer>
  );
};

export default ProgressBar;