import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Container,
  Title,
  InputField,
  TextArea,
  QuestionCard,
  QuestionHeader,
  QuestionNumber,
  Select,
  AnswersGrid,
  AnswerItem,
  RadioInput,
  DeleteButton,
  SecondaryButton,
  PrimaryButton,
  ButtonGroup,
  DeleteButtonWrapper
} from "./styles.js";

const UpdateQuestion = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "trueFalse",
      answers: ["Yes", "No"],
      selectedAnswers: [],
      question: "",
    },
  ]);

  const questionTypes = [
    { value: "trueFalse", label: "Đúng/Sai" },
    { value: "multiAnswer", label: "Nhiều đáp án" },
    { value: "singleAnswer", label: "Chọn 1 đáp án" },
  ];

  const getDefaultAnswers = (type) => {
    switch (type) {
      case "trueFalse":
        return ["Yes", "No"];
      case "multiAnswer":
      case "singleAnswer":
        return ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"];
      default:
        return [];
    }
  };

  const handleTypeChange = (questionId, newType) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            type: newType,
            answers: getDefaultAnswers(newType),
            selectedAnswers: [],
          };
        }
        return question;
      })
    );
  };

  const handleAnswerChange = (questionId, answerIndex, checked) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          let newSelectedAnswers = [...question.selectedAnswers];

          if (
            question.type === "trueFalse" ||
            question.type === "singleAnswer"
          ) {
            newSelectedAnswers = [answerIndex];
          } else {
            if (checked) {
              newSelectedAnswers.push(answerIndex);
            } else {
              newSelectedAnswers = newSelectedAnswers.filter(
                (i) => i !== answerIndex
              );
            }
          }

          return { ...question, selectedAnswers: newSelectedAnswers };
        }
        return question;
      })
    );
  };

  const updateQuestionText = (questionId, text) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, question: text } : q))
    );
  };

  const updateAnswerText = (questionId, answerIndex, text) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newAnswers = [...q.answers];
          newAnswers[answerIndex] = text;
          return { ...q, answers: newAnswers };
        }
        return q;
      })
    );
  };

  return (
    <Container>
      <Title>Cập nhật học phần</Title>

      <InputField type="text" placeholder="Nhập tiêu đề..." />
      <TextArea placeholder="Nhập mô tả..." rows={3} />

      {questions.map((question, qIndex) => (
        <QuestionCard key={question.id}>
          <QuestionHeader>
            <QuestionNumber>Câu {qIndex + 1}</QuestionNumber>
            <Select
              value={question.type}
              onChange={(e) => handleTypeChange(question.id, e.target.value)}
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </QuestionHeader>

          <InputField
            type="text"
            placeholder="Nhập câu hỏi..."
            value={question.question}
            onChange={(e) => updateQuestionText(question.id, e.target.value)}
          />

          <AnswersGrid>
            {question.answers.map((answer, index) => (
              <AnswerItem key={index}>
                <RadioInput
                  type={question.type === "multiAnswer" ? "checkbox" : "radio"}
                  name={`question-${question.id}`}
                  checked={question.selectedAnswers.includes(index)}
                  onChange={(e) =>
                    handleAnswerChange(question.id, index, e.target.checked)
                  }
                />
                <InputField
                  type="text"
                  value={answer}
                  onChange={(e) =>
                    updateAnswerText(question.id, index, e.target.value)
                  }
                  placeholder={`Đáp án ${index + 1}`}
                />
              </AnswerItem>
            ))}
          </AnswersGrid>

          <DeleteButtonWrapper>
            <DeleteButton>
              <Trash2 size={20} />
            </DeleteButton>
          </DeleteButtonWrapper>
        </QuestionCard>
      ))}

      <ButtonGroup>
        <SecondaryButton>Trở lại</SecondaryButton>
        <PrimaryButton>Cập nhật</PrimaryButton>
      </ButtonGroup>
    </Container>
  );
};

export default UpdateQuestion;
