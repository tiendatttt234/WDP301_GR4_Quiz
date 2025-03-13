import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

export const HeaderTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;

  button {
    display: flex;
    align-items: center;
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }

    span {
      margin-left: 5px;
      font-size: 14px;
      color: #2c3e50;
    }
  }
`;

export const Description = styled.p`
  margin: 6px 0;
  color: #34495e;
  font-size: 16px;
`;

export const QuestionCard = styled.div`
  border: none;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const QuestionContent = styled.div`
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
  font-size: 17px;
`;

export const TypeLabel = styled.div`
  font-style: italic;
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 12px;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
`;

export const Answer = styled.div`
  margin: 8px 0 8px 25px;
  color: ${props => props.isCorrect ? '#27ae60' : '#7f8c8d'};
  font-size: 15px;
  position: relative;
  
  &:before {
    content: '•';
    position: absolute;
    left: -15px;
    color: ${props => props.isCorrect ? '#27ae60' : '#7f8c8d'};
  }
`;

export const ErrorMessage = styled.p`
  color: #e74c3c;
  text-align: center;
  margin: 30px 0;
  font-size: 16px;
  font-weight: 500;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 25px 0;
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    background: #3498db;
    color: white;
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover:not(:disabled) {
      background: #2980b9;
    }
    
    &:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  }
  
  span {
    font-size: 15px;
    color: #2c3e50;
  }
`;