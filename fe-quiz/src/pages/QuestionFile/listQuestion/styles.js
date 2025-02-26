import styled from "styled-components";

export const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fc;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
`;

export const TabMenu = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #e2e8f0;
`;

export const Tab = styled.button`
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#1d4ed8" : "#64748b")};
  border: none;
  background: none;
  padding: 10px;
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "2px solid #1d4ed8" : "none")};

  &:hover {
    color: #1d4ed8;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 5px;
`;

export const SearchIcon = styled.div`
  color: #64748b;
  cursor: pointer;
`;

export const QuestionList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const QuestionItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

// export const QuestionTitle = styled.h3`
//   font-size: 18px;
//   font-weight: bold;
//   color: #1e293b;
// `;

export const QuestionMeta = styled.span`
  font-size: 14px;
  color: #64748b;
`;

export const QuestionDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #6b7280;
`;

export const QuestionCount = styled.span`
  font-weight: bold;
`;

export const QuestionAuthor = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 20px;
`;

export const QuestionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #2d2d2d;
  margin-top: 15px;
  padding-top: 5px;
  margin-bottom: 8px;
`;