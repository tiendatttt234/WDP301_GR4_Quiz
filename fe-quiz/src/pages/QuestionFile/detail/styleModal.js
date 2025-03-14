import styled from 'styled-components';

export const ModalContent = styled.div`
  position: relative;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #7f8c8d;

  &:hover {
    color: #2c3e50;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
`;

export const ModalOption = styled.label`
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 16px;
  color: #34495e;
  cursor: pointer;
`;

export const ModalRadioInput = styled.input`
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const ModalButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }
`;