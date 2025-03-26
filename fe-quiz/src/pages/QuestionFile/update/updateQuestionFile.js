import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Plus, Save } from "lucide-react";
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
  DeleteButtonWrapper,
  AddAnswerButton,
  SaveButton,
  AddButton,
  HeaderContainer,
  ToggleButton,
  Pagination,
} from "./styles.js";

const QUESTIONS_PER_PAGE = 10;

const UpdateQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [dirtyQuestions, setDirtyQuestions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const questionTypes = [
    { value: "trueFalse", label: "Đúng/Sai" },
    { value: "multiAnswer", label: "Nhiều đáp án" },
    { value: "singleAnswer", label: "Chọn 1 đáp án" },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:9999/questionFile/getById/${id}`)
      .then((response) => {
        const {
          name,
          description,
          arrayQuestion,
          isPrivate: privateStatus,
        } = response.data.questionFile;
        setTitle(name);
        setDescription(description);
        setIsPrivate(privateStatus);
        const formattedQuestions = arrayQuestion.map((q) => ({
          id: q.questionId, // Dùng _id từ embedded document
          question: q.content,
          type:
            q.type === "MCQ"
              ? "multiAnswer"
              : q.type === "MAQ"
              ? "multiAnswer"
              : q.type,
          answers: q.answers.map((a) => a.answerContent),
          selectedAnswers: q.answers
            .map((a, index) => (a.isCorrect ? index : null))
            .filter((i) => i !== null),
        }));
        setQuestions(formattedQuestions);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu, có chắc muốn rời đi không?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const markAsDirty = (questionId) => {
    setIsDirty(true);
    setDirtyQuestions((prev) => ({ ...prev, [questionId]: true }));
  };

  const validateForm = () => {
    if (!title.trim()) return "Vui lòng nhập tiêu đề!";
    if (!description.trim()) return "Vui lòng nhập mô tả!";
    for (let q of questions) {
      if (!q.question.trim())
        return "Vui lòng nhập nội dung cho tất cả câu hỏi!";
      if (q.selectedAnswers.length === 0)
        return "Vui lòng chọn ít nhất một đáp án đúng cho mỗi câu hỏi";
    }
    return null;
  };

  const handleTogglePrivacy = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }
    const newPrivacy = !isPrivate;
    setIsPrivate(newPrivacy);

    // Gửi PATCH request để cập nhật isPrivate tức thời
    axios
      .patch(`http://localhost:9999/questionFile/updatePrivacy/${id}`, 
        { isPrivate: newPrivacy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(
          "Response from toggle:",
          JSON.stringify(response.data, null, 2)
        );
        if (
          !response.data.result ||
          typeof response.data.result.isPrivate === "undefined"
        ) {
          throw new Error("Response không chứa isPrivate");
        }
        setIsPrivate(response.data.result.isPrivate); // Đồng bộ từ server
        toast.success(`Đã đặt ${newPrivacy ? "riêng tư" : "công khai"}!`, {
          autoClose: 2000,
        });
        setIsDirty(false); // Không cần lưu thêm vì đã cập nhật
      })
      .catch((error) => {
        console.error(
          "Lỗi khi cập nhật isPrivate:",
          error.response?.data || error.message
        );
        toast.error("Cập nhật trạng thái thất bại!");
        setIsPrivate(!newPrivacy); // Hoàn tác nếu thất bại
      });
  };

  const handleTypeChange = (questionId, newType) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          const newSelectedAnswers =
            newType === "singleAnswer" && question.selectedAnswers.length > 1
              ? [question.selectedAnswers[0]]
              : question.selectedAnswers;
          return {
            ...question,
            type: newType,
            selectedAnswers: newSelectedAnswers,
          };
        }
        return question;
      })
    );
    markAsDirty(questionId);
  };

  const handleAnswerChange = (questionId, answerIndex, checked) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          let newSelectedAnswers =
            question.type === "multiAnswer"
              ? checked
                ? [...question.selectedAnswers, answerIndex]
                : question.selectedAnswers.filter((i) => i !== answerIndex)
              : [answerIndex];
          return { ...question, selectedAnswers: newSelectedAnswers };
        }
        return question;
      })
    );
    markAsDirty(questionId);
  };

  const updateQuestionText = (questionId, text) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, question: text } : q))
    );
    markAsDirty(questionId);
  };

  const updateAnswerText = (questionId, answerIndex, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((ans, i) =>
                i === answerIndex ? text : ans
              ),
            }
          : q
      )
    );
    markAsDirty(questionId);
  };

  const addAnswer = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, `Đáp án ${q.answers.length + 1}`] }
          : q
      )
    );
    markAsDirty(questionId);
  };

  const deleteAnswer = (questionId, answerIndex) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.answers.length > 2) {
          const newAnswers = q.answers.filter((_, i) => i !== answerIndex);
          const newSelectedAnswers = q.selectedAnswers
            .map((i) => (i > answerIndex ? i - 1 : i))
            .filter((i) => i !== answerIndex);
          return {
            ...q,
            answers: newAnswers,
            selectedAnswers: newSelectedAnswers,
          };
        }
        return q;
      })
    );
    markAsDirty(questionId);
  };

  const saveQuestion = (questionId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }
    const error = validateForm();
    if (error) {
      toast.error(error, { autoClose: 2000 });
      return;
    }
    const question = questions.find((q) => q.id === questionId);
    // Nếu chưa có id hợp lệ (câu hỏi mới), không gửi PATCH
    if (!question.id || question.id.startsWith("temp-")) {
      toast.info("Câu hỏi mới sẽ được lưu khi nhấn 'Cập nhật toàn bộ'!", {
        autoClose: 2000,
      });
      return;
    }

    const formattedQuestion = {
      content: question.question,
      type:
        question.type === "multiAnswer"
          ? "MAQ"
          : question.type === "trueFalse"
          ? "Boolean"
          : "MCQ",
      answers: question.answers.map((answer, index) => ({
        answerContent: answer,
        isCorrect: question.selectedAnswers.includes(index),
      })),
    };

    axios
      .patch(
        `http://localhost:9999/questionFile/update/${id}/question/${questionId}`,
        formattedQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const questionIndex = questions.findIndex((q) => q.id === questionId);
        toast.success(
          `Đã lưu câu hỏi ${questionIndex + 1} vào cơ sở dữ liệu!`,
          { autoClose: 2000 }
        );
        setDirtyQuestions((prev) => ({ ...prev, [questionId]: false }));
        if (
          !Object.values({ ...dirtyQuestions, [questionId]: false }).some(
            (v) => v
          )
        ) {
          setIsDirty(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lưu câu hỏi:", error);
        toast.error(`Lưu câu hỏi thất bại!`);
      });
  };

  const addQuestion = () => {
    const error = validateForm();
    if (error) {
      toast.error(error, { autoClose: 2000 });
      return;
    }
    const newId = `temp-${Date.now()}`; // ID tạm cho câu hỏi mới
    const newQuestion = {
      id: newId,
      question: "Câu hỏi mới",
      type: "trueFalse",
      answers: ["Đúng", "Sai"],
      selectedAnswers: [],
    };
    setQuestions([...questions, newQuestion]);
    setIsDirty(true);
    toast.success("Đã thêm câu hỏi mới! Nhấn 'Cập nhật toàn bộ' để lưu.", {
      autoClose: 2000,
    });
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }
    const error = validateForm();
    if (error) {
      toast.error(error, { autoClose: 2000 });
      return;
    }
    const formattedData = {
      name: title,
      description: description,
      isPrivate: isPrivate,
      arrayQuestion: questions.map((q) => ({
        _id: q.id && !q.id.startsWith("temp-") ? q.id : undefined, // Chỉ gửi _id cho câu hỏi cũ
        content: q.question,
        type:
          q.type === "multiAnswer"
            ? "MAQ"
            : q.type === "trueFalse"
            ? "Boolean"
            : "MCQ",
        answers: q.answers.map((answer, index) => ({
          answerContent: answer,
          isCorrect: q.selectedAnswers.includes(index),
        })),
      })),
    };

    axios
      .put(`http://localhost:9999/questionFile/update/${id}`, formattedData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      .then((response) => {
        const updatedQuestions = response.data.result.arrayQuestion.map(
          (q) => ({
            id: q.questionId, // Dùng _id từ server
            question: q.content,
            type:
              q.type === "MAQ"
                ? "multiAnswer"
                : q.type === "Boolean"
                ? "trueFalse"
                : "singleAnswer",
            answers: q.answers.map((a) => a.answerContent),
            selectedAnswers: q.answers
              .map((a, index) => (a.isCorrect ? index : null))
              .filter((i) => i !== null),
          })
        );
        setQuestions(updatedQuestions);
        setIsPrivate(response.data.result.isPrivate);
        toast.success("Cập nhật toàn bộ học phần thành công!", {
          autoClose: 4000,
        });
        setIsDirty(false);
        setDirtyQuestions({});
      })
      .catch((error) => {
        console.error(
          "Lỗi khi cập nhật dữ liệu:",
          error.response?.data || error.message
        );
        toast.error("Cập nhật thất bại!");
      });
  };

  const handleBack = () => {
    if (isDirty) {
      if (
        window.confirm("Bạn có thay đổi chưa lưu, có chắc muốn rời đi không?")
      ) {
        navigate("questionfile/getAll");
      }
    } else {
      navigate(-1);
    }
  };
  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  return (
    <Container>
      <ToastContainer />
      <HeaderContainer>
        <Title>Cập nhật học phần</Title>
        <ToggleButton isPrivate={isPrivate} onClick={handleTogglePrivacy}>
          {isPrivate ? "Riêng tư" : "Công khai"}
        </ToggleButton>
      </HeaderContainer>
      <InputField
        type="text"
        placeholder="Nhập tiêu đề..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setIsDirty(true);
        }}
      />
      <TextArea
        placeholder="Nhập mô tả..."
        rows={3}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setIsDirty(true);
        }}
      />

      {paginatedQuestions.map((question, qIndex) => (
        <QuestionCard key={question.id}>
          <QuestionHeader>
            <QuestionNumber>Câu {startIndex + qIndex + 1}</QuestionNumber>
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
                <DeleteButton onClick={() => deleteAnswer(question.id, index)}>
                  <Trash2 size={20} />
                </DeleteButton>
              </AnswerItem>
            ))}
          </AnswersGrid>

          <AddAnswerButton onClick={() => addAnswer(question.id)}>
            <Plus size={20} /> Thêm đáp án
          </AddAnswerButton>

          <DeleteButtonWrapper>
            <SaveButton
              onClick={() => saveQuestion(question.id)}
              disabled={!dirtyQuestions[question.id]}
            >
              <Save size={20} /> Lưu
            </SaveButton>
            <DeleteButton onClick={() => removeQuestion(question.id)}>
              <Trash2 size={20} />
            </DeleteButton>
          </DeleteButtonWrapper>
        </QuestionCard>
      ))}

      {totalPages > 1 && (
        <Pagination>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </Pagination>
      )}

      <AddButton onClick={addQuestion}>
        <Plus size={20} />
        <span>Thêm câu hỏi</span>
      </AddButton>

      <ButtonGroup>
        <SecondaryButton onClick={handleBack}>Trở lại</SecondaryButton>
        <PrimaryButton onClick={handleUpdate}>Cập nhật toàn bộ</PrimaryButton>
      </ButtonGroup>
    </Container>
  );
};

export default UpdateQuestion;
