import styled from "styled-components";

export const Container = styled.div`
  width: 85%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc, #eef2ff);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  min-height: 80vh;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 1rem;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const TabMenu = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

export const Tab = styled.button`
  font-size: 1.125rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  color: ${(props) => (props.active ? "#1d4ed8" : "#64748b")};
  border: none;
  background: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #1d4ed8;
    transform: ${(props) => (props.active ? "scaleX(1)" : "scaleX(0)")};
    transform-origin: bottom center;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: white;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.5rem;
  background: transparent;
  color: #1e293b;

  &::placeholder {
    color: #94a3b8;
  }
`;

export const SearchIcon = styled.div`
  color: #64748b;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #1d4ed8;
  }
`;

export const QuestionList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const QuestionItem = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex; /* Sử dụng flex để căn chỉnh nội dung và nút xóa */
  justify-content: space-between; /* Đẩy nội dung sang trái, nút xóa sang phải */
  align-items: center; /* Căn giữa theo chiều dọc */

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #dbeafe;
  }
`;

export const QuestionDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

export const QuestionCount = styled.span`
  font-weight: 600;
  background-color: #eff6ff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  color: #1d4ed8;
`;

export const QuestionAuthor = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-style: italic;
`;

export const QuestionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-top: 1rem;
  margin-left: 10px;
  line-height: 1.4;
  transition: color 0.3s ease;

  ${QuestionItem}:hover & {
    color: #1d4ed8;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #ef4444; /* Đỏ khi hover */
    transform: scale(1.1);
  }
`;
export const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;