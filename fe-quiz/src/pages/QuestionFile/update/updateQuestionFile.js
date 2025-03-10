import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const { id } = useParams(); // Lấy id từ URL
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  // Lấy dữ liệu từ DB khi chọn học phần
  useEffect(() => {
    axios
      .get(`http://localhost:9999/questionFile/getById/${id}`)
      .then((response) => {
        const { name, description, arrayQuestion } = response.data.questionFile;
        setTitle(name);
        setDescription(description);
        const formattedQuestions = arrayQuestion.map((q) => ({
          id: q.questionId,
          question: q.content,
          type: q.type === "MCQ" ? "multiAnswer" : q.type, // Chuyển đổi type
          answers: q.answers.map((a) => a.answerContent),
          selectedAnswers: q.answers
            .map((a, index) => (a.isCorrect ? index : null))
            .filter((i) => i !== null), // Lấy index của đáp án đúng
        }));
  
        setQuestions(formattedQuestions);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, [id]);

  const handleTypeChange = (questionId, newType) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          // Nếu chuyển đổi loại câu hỏi, giữ nguyên đáp án và trạng thái đúng/sai
          return {
            ...question,
            type: newType,
            selectedAnswers: question.answers
              .map((answer, index) => (answer.isCorrect ? index : null))
              .filter((index) => index !== null),
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
          let newSelectedAnswers = question.type === "multiAnswer"
            ? checked
              ? [...question.selectedAnswers, answerIndex]
              : question.selectedAnswers.filter((i) => i !== answerIndex)
            : [answerIndex];

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
      questions.map((q) =>
        q.id === questionId
          ? { ...q, answers: q.answers.map((ans, i) => (i === answerIndex ? text : ans)) }
          : q
      )
    );
  };

  // Xử lý cập nhật học phần
  const handleUpdate = () => {
    const formattedData = {
      name: title,
      description: description,
      isPrivate: false, // Bạn có thể thay đổi giá trị này nếu cần
      arrayQuestion: questions.map((q) => ({
        questionId: q.id, 
        content: q.question,
        type: q.type === "multiAnswer" ? "MCQ" : q.type, // Chuyển đổi lại type
        answers: q.answers.map((answer, index) => ({
          answerId: `ans-${q.id}-${index}`, // Tạo ID giả lập nếu cần
          answerContent: answer,
          isCorrect: q.selectedAnswers.includes(index), // Check xem đáp án có đúng không
        })),
      })),
    };
  
    axios
      .put(`http://localhost:9999/questionFile/update/${id}`, formattedData)
      .then((response) => {
        toast.success("Cập nhật câu hỏi thành công!", { autoClose: 4000 });
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
        alert("Cập nhật thất bại!");
      });
  };
  
  return (
    <Container>
      <ToastContainer />
      <Title>Cập nhật học phần</Title>

      <InputField
        type="text"
        placeholder="Nhập tiêu đề..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        placeholder="Nhập mô tả..."
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

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
        <PrimaryButton onClick={handleUpdate}>Cập nhật</PrimaryButton>
      </ButtonGroup>
    </Container>
  );
};

export default UpdateQuestion;
