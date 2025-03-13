import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;  // Tăng chiều rộng tối đa để thoáng hơn
  margin: 2rem auto;  // Tăng margin để căn giữa đẹp hơn
  padding: 2rem;      // Tăng padding cho thoáng
  background-color: #ffffff;
  border-radius: 12px; // Bo góc mềm mại hơn
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); // Shadow nhẹ và hiện đại
`;

export const Title = styled.h1`
  font-size: 2rem;    // Tăng kích thước tiêu đề
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e40af;    // Màu xanh đậm hơn, chuyên nghiệp hơn
  text-align: center; // Căn giữa tiêu đề
`;

export const InputField = styled.input`
  width: 100%;       // Đảm bảo full width
  padding: 0.75rem 1rem; // Tăng padding cho thoải mái
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px; // Bo góc nhẹ nhàng hơn
  background-color: #f8fafc;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: #ffffff;
  }

  &::placeholder {
    color: #94a3b8; // Màu placeholder nhẹ nhàng
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  font-size: 1rem;
  resize: vertical;  // Cho phép kéo dãn theo chiều dọc
  min-height: 100px; // Chiều cao tối thiểu
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: #ffffff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const QuestionCard = styled.div`
  padding: 1.5rem;   // Tăng padding cho thoáng
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff; // Đổi nền trắng cho sạch sẽ
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  &:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`;

export const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9; // Thêm đường viền nhẹ
`;

export const QuestionNumber = styled.span`
  font-weight: 600;
  font-size: 1.125rem;
  color: #1e40af;
`;

export const Select = styled.select`
  padding: 0.5rem 2rem 0.5rem 1rem; // Tăng padding phải cho đẹp hơn
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const AnswersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem; // Tăng khoảng cách giữa các đáp án
`;

export const AnswerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    transform: translateX(2px);
  }
`;

export const RadioInput = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #2563eb; // Màu nhấn cho radio/checkbox
  cursor: pointer;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem; // Tăng kích thước nút
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
`;

export const PrimaryButton = styled(Button)`
  background-color: #2563eb;
  color: white;
  border: none;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled(Button)`
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #4b5563;

  &:hover {
    background-color: #f8fafc;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
`;

export const DeleteButton = styled.button`
  padding: 0.5rem;
  color: #9ca3af;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #dc2626;
    transform: scale(1.1);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center; // Căn giữa các nút
  gap: 1rem; // Khoảng cách giữa các nút
  margin-top: 2rem;
`;

export const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;
export const AddAnswerButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #10b981; // Màu xanh lá để phân biệt
  border-radius: 9999px;

  &:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }
`;
export const SaveButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  background-color: #8b5cf6; // Màu tím để phân biệt
  padding: 0.5rem 1rem;

  &:hover {
    background-color: #7c3aed;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
export const AddButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  margin: 1rem auto;
  background-color: #10b981; // Màu xanh lá để phân biệt
  &:hover {
    background-color: #059669;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between; // Căn title bên trái, toggle bên phải
  align-items: center; // Căn theo chiều dọc
  margin-bottom: 2rem; // Khoảng cách với phần dưới
`;

export const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ isPrivate }) => (isPrivate ? "#ef4444" : "#10b981")}; // Đỏ khi riêng tư, xanh khi công khai
  background-color: ${({ isPrivate }) => (isPrivate ? "#fee2e2" : "#d1fae5")}; // Nền nhạt
  color: ${({ isPrivate }) => (isPrivate ? "#ef4444" : "#10b981")}; // Chữ đỏ/xanh
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isPrivate }) => (isPrivate ? "#fecaca" : "#bbf7d0")}; // Hover sáng hơn
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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