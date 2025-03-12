import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Title,
    Answer,Container,Description,ErrorMessage,Header,QuestionCard,QuestionContent,TypeLabel
} from './styles.js'
import FlashcardList from '../../Quiz/FlashCard/FlashCards.jsx';

const QuestionFileDetail = () => {
  const { id } = useParams();
  const [questionFile, setQuestionFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionFile = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/questionFile/getById/${id}`);
        setQuestionFile(response.data.questionFile);
        console.log(response.data.questionFile);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionFile();
  }, [id]);

  const getQuestionTypeLabel = (type) => {
    switch(type) {
      case 'MCQ': return 'Trắc nghiệm một lựa chọn';
      case 'MAQ': return 'Trắc nghiệm nhiều lựa chọn';
      case 'Boolean': return 'Đúng/Sai';
      default: return type;
    }
  };

  if (loading) return <Container><ErrorMessage>Đang tải...</ErrorMessage></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  if (!questionFile) return null;

  return (
    <Container>
      <Header>
        <Title>{questionFile.name}</Title>
        <Description>{questionFile.description}</Description>
        <Description>Trạng thái: {questionFile.isPrivate ? 'Riêng tư' : 'Công khai'}</Description>
      </Header>
      <FlashcardList questionFile={questionFile} />
      {questionFile.arrayQuestion.map((question) => (
        <QuestionCard key={question.questionId}>
          <QuestionContent>{question.content}</QuestionContent>
          <TypeLabel>Loại câu hỏi: {getQuestionTypeLabel(question.type)}</TypeLabel>
          {question.answers.map((answer) => (
            <Answer 
              key={answer.answerId}
              isCorrect={answer.isCorrect}
            >
              {answer.answerContent} {answer.isCorrect ? '(Đúng)' : ''}
            </Answer>
          ))}
        </QuestionCard>
      ))}
    </Container>
  );
};

export default QuestionFileDetail;