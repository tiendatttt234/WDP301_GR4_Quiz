"use client"
import styled from "styled-components"
import { CheckCircle, XCircle, ArrowRight, RotateCcw, ArrowLeft } from "lucide-react"

// Styled components
const SummaryCard = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
  overflow: hidden;
`

const CardHeader = styled.div`
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
`

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`

const ScorePercentage = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${(props) => (props.isGood ? "#10b981" : "#f59e0b")};
`

const ScoreText = styled.div`
  color: #64748b;
`

const CardContent = styled.div`
  padding: 1.5rem;
`

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
`

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const QuestionItem = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
  }
`

const QuestionContent = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`

const IconWrapper = styled.div`
  margin-top: 0.25rem;
`

const QuestionText = styled.p`
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 0.5rem;
  flex: 1;
`

const AnswerBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

const Badge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
`

const WrongAttemptsText = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) =>
    props.primary
      ? `
    background-color: #3b82f6;
    color: white;
    border: none;
    
    &:hover {
      background-color: #2563eb;
    }
  `
      : `
    background-color: transparent;
    color: #3b82f6;
    border: 1px solid #d1d5db;
    
    &:hover {
      background-color: #f8fafc;
      border-color: #3b82f6;
    }
  `}
`

const RoundSummary = ({ roundSummary, onContinue, onRestart, onBack, isCompleted }) => {
  return (
    <SummaryCard>
      <CardHeader>
        <CardTitle>Kết quả lượt {roundSummary.roundNumber}</CardTitle>
        <ScoreDisplay>
          <ScoreText>
            ({roundSummary.correctCount}/{roundSummary.totalInRound} câu )
          </ScoreText>
        </ScoreDisplay>
      </CardHeader>
      <CardContent>
        <SectionTitle>Chi tiết câu hỏi</SectionTitle>
        <QuestionsList>
          {roundSummary.questions.map((question, index) => (
            <QuestionItem key={index}>
              <QuestionContent>
                <IconWrapper>
                  {question.wrongAttempts === 0 ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <XCircle size={20} color="#ef4444" />
                  )}
                </IconWrapper>
                <div>
                  <QuestionText>{question.content}</QuestionText>
                  <AnswerBadges>
                    {question.correctAnswers.map((answer, i) => (
                      <Badge key={i}>{answer}</Badge>
                    ))}
                  </AnswerBadges>
                  {question.wrongAttempts > 0 && (
                    <WrongAttemptsText>Số lần trả lời sai: {question.wrongAttempts}</WrongAttemptsText>
                  )}
                </div>
              </QuestionContent>
            </QuestionItem>
          ))}
        </QuestionsList>
      </CardContent>

      <CardFooter>
        {!isCompleted ? (
          <Button primary onClick={onContinue}>
            Tiếp tục <ArrowRight size={16} />
          </Button>
        ) : onRestart ? (
          <Button primary onClick={onRestart}>
            Học lại <RotateCcw size={16} />
          </Button>
        ) : null}

        <Button onClick={onBack}>
          <ArrowLeft size={16} /> Trở về
        </Button>
      </CardFooter>
    </SummaryCard>
  )
}

export default RoundSummary

