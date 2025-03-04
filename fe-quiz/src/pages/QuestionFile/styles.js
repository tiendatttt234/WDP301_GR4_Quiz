import styled from "styled-components";

export const Container = styled.div`
  max-width: 90%;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #2563eb;
`;

export const InputField = styled.input`
  width: 97%;
  padding: 0.5rem;
  margin-bottom: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

export const TextArea = styled.textarea`
  width: 97%;
  padding: 0.5rem;
  margin-bottom: 11px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

export const QuestionCard = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-0.25rem);
  }
`;

export const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const QuestionNumber = styled.span`
  font-weight: 500;
  color: #2563eb;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

export const AnswersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const AnswerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
  }
`;

export const RadioInput = styled.input`
  border: 1px solid #d1d5db;
  color: #2563eb;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  cursor: pointer;
`;

export const PrimaryButton = styled(Button)`
  background-color: #2563eb;
  color: white;
  border: none;

  &:hover {
    background-color: #1d4ed8;
    transform: scale(1.05);
  }
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: space-between; /* Đẩy tiêu đề sang trái, nút sang phải */
  width: 100%;
  margin-bottom: 10px;
`;


export const SecondaryButton = styled(Button)`
  border: 1px solid #e5e7eb;
  background-color: white;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const DeleteButton = styled.button`
  padding: 0.5rem;
  color: #6b7280;
  transition: color 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #ef4444;
  }
`;

export const AddButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  margin: 1rem auto;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;
export const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
`;
