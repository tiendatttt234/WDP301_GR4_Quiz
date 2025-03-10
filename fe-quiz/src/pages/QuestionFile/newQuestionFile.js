import React, { useState } from "react";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.js";
import {
  Container,
  Title,
  AddButton,
  AnswerItem,
  AnswersGrid,
  ButtonGroup,
  InputField,
  TextArea,
  QuestionCard,
  QuestionHeader,
  QuestionNumber,
  Select,
  RadioInput,
  DeleteButton,
  SecondaryButton,
  PrimaryButton,
  DeleteButtonWrapper
} from "./styles.js";

const QuestionCreator = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "trueFalse",
      answers: ["Yes", "No"],
      selectedAnswers: [],
      question: "",
    },
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const validateForm = () => {
    if (!title.trim()) return "Vui lòng nhập tiêu đề";
    if (!description.trim()) return "Vui lòng nhập mô tả";
    for (let q of questions) {
      if (!q.question.trim()) return "Mỗi câu hỏi cần có nội dung";
      for (let ans of q.answers) {
        if (!ans.trim()) return "Mỗi đáp án cần có nội dung";
      }
    }
    return null;
  };

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

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        type: "trueFalse",
        answers: getDefaultAnswers("trueFalse"),
        selectedAnswers: [],
        question: "",
      },
    ]);
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
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
  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    const formattedQuestions = questions.map((q) => ({
      content: q.question,
      type: q.type === "trueFalse" ? "Boolean" : q.type === "multiAnswer" ? "MAQ" : "MCQ",
      answers: q.answers.map((ans, index) => ({
        answerContent: ans,
        isCorrect: q.selectedAnswers.includes(index),
      })),
    }));

    const payload = {
      name: title,
      description,
      arrayQuestion: formattedQuestions,
    };

    try {
      await axios.post("http://localhost:9999/questionFile/create", payload);
      toast.success("Tạo bộ câu hỏi thành công!", { autoClose: 4000 });
      setTimeout(() => navigate("/user/questionfile/getAll"), 4000);
    } catch (error) {
      toast.error("Lỗi khi tạo bộ câu hỏi");
      console.error(error);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Title>Tạo học phần mới</Title>

      <InputField type="text" placeholder="Nhập tiêu đề..." onChange={(e) => setTitle(e.target.value)}/>
      <TextArea placeholder="Nhập mô tả..." rows={3} onChange={(e) => setDescription(e.target.value)}/>

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
          <DeleteButton onClick={() => removeQuestion(question.id)}>
            <Trash2 size={20} />
          </DeleteButton>
          </DeleteButtonWrapper> 
        </QuestionCard>
      ))}

      <AddButton onClick={addQuestion}>
        <Plus size={20} />
        <span>Thêm câu hỏi</span>
      </AddButton>

      <ButtonGroup>
        <SecondaryButton>Trở lại</SecondaryButton>
        <PrimaryButton onClick={handleSubmit}>Tạo và ôn luyện</PrimaryButton>
      </ButtonGroup>
    </Container>
  );
};

export default QuestionCreator;
