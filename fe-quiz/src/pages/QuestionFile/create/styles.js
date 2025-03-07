import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  overflow: hidden; /* Ngăn container cha tạo thanh cuộn */
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e40af;
  background: linear-gradient(to right, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fff;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const QuestionCard = styled.div`
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  min-height: 200px;

  &:hover {
    border-color: #dbeafe;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
    transform: translateY(-4px);
  }
`;

export const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

export const QuestionNumber = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e40af;
`;

export const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

export const AnswersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: start;
  margin-top: 10px;
`;

export const AnswerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f1f5f9;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0e7ff;
  }
`;

export const RadioInput = styled.input`
  accent-color: #2563eb;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
`;

export const PrimaryButton = styled(Button)`
  background-color: #2563eb;
  color: white;
  border: none;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  gap: 1rem;
`;

export const SecondaryButton = styled(Button)`
  border: 2px solid #e5e7eb;
  background-color: #fff;
  color: #4b5563;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-2px);
  }
`;

export const DeleteButton = styled.button`
  padding: 0.5rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #ef4444;
    transform: scale(1.1);
  }
`;

export const AddButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 50px;
  padding: 0.75rem 2rem;

  &:hover {
    background-color: #1d4ed8;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.2);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

export const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const ImportButtonContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-height: 80vh; /* Giới hạn chiều cao tối đa */
  overflow-y: auto; /* Chỉ cuộn dọc khi cần */
  overflow-x: hidden; /* Loại bỏ thanh cuộn ngang */
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 700px;
  height: 500px; 
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #ef4444;
  }
`;

export const ExampleText = styled.pre`
  white-space: pre-wrap; /* Giữ định dạng nhưng không cuộn ngang */
  word-wrap: break-word;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Loại bỏ thanh cuộn ngang trong ví dụ */
  font-family: inherit; /* Sử dụng font của cha để đồng nhất */
`;