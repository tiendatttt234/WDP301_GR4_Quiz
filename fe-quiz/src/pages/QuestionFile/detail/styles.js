import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
`;

export const Header = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  margin: 0 0 10px 0;
  font-size: 24px;
`;

export const Description = styled.p`
  margin: 5px 0;
  color: #333;
`;

export const QuestionCard = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
`;

export const QuestionContent = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TypeLabel = styled.div`
  font-style: italic;
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
`;

export const Answer = styled.div`
  margin: 5px 0 5px 20px;
  color: ${props => props.isCorrect ? '#2ecc71' : '#e74c3c'};
`;

export const ErrorMessage = styled.p`
  color: #e74c3c;
  text-align: center;
  margin: 20px 0;
`;
