import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
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
  DeleteButtonWrapper,
  ButtonContainer,
  ImportButtonContainer,
  ModalContent,
  CloseButton,
  Pagination,
} from "./styles.js";

Modal.setAppElement("#root");
const QUESTIONS_PER_PAGE = 10;

const QuestionCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "trueFalse",
      answers: ["Đúng", "Sai"],
      selectedAnswers: [],
      question: "",
    },
    {
      id: 2,
      type: "trueFalse",
      answers: ["Đúng", "Sai"],
      selectedAnswers: [],
      question: "",
    },
  ]);
  const [isDirty, setIsDirty] = useState(false);
  // const [useVirtualized, setUseVirtualized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue =
          "Nếu bạn rời đi sẽ mất dữ liệu bạn vừa nhập. Bạn có chắc chắn muốn rời đi không?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (
      title ||
      description ||
      questions.some((q) => q.question || q.answers.some((a) => a))
    ) {
      setIsDirty(true);
    }
  }, [title, description, questions]);

  const validateForm = () => {
    if (!title.trim()) return "Vui lòng nhập tiêu đề";
    if (!description.trim()) return "Vui lòng nhập mô tả";
    for (let q of questions) {
      if (!q.question.trim()) return "Mỗi câu hỏi cần có nội dung";
      for (let ans of q.answers) {
        if (!ans.trim()) return "Mỗi đáp án cần có nội dung";
      }
      if (q.selectedAnswers.length === 0)
        return "Vui lòng chọn ít nhất một đáp án đúng cho mỗi câu hỏi";
    }
    return null;
  };

  const questionTypes = [
    { value: "trueFalse", label: "Đúng/Sai" },
    { value: "multiAnswer", label: "Nhiều đáp án" },
    { value: "singleAnswer", label: "Chọn 1 đáp án" },
  ];

  const handleTypeChange = (questionId, newType) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          let newSelectedAnswers = [...question.selectedAnswers];
          if (newType === "trueFalse" || newType === "singleAnswer") {
            newSelectedAnswers =
              newSelectedAnswers.length > 0 ? [newSelectedAnswers[0]] : [];
          }
          return {
            ...question,
            type: newType,
            selectedAnswers: newSelectedAnswers,
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
            if (checked) newSelectedAnswers.push(answerIndex);
            else
              newSelectedAnswers = newSelectedAnswers.filter(
                (i) => i !== answerIndex
              );
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
        answers: ["Đúng", "Sai"],
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

  const addAnswer = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, `Đáp án ${q.answers.length + 1}`],
          };
        }
        return q;
      })
    );
  };

  const removeAnswer = (questionId, answerIndex) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newAnswers = q.answers.filter((_, idx) => idx !== answerIndex);
          const newSelectedAnswers = q.selectedAnswers
            .filter((idx) => idx !== answerIndex)
            .map((idx) => (idx > answerIndex ? idx - 1 : idx));
          return {
            ...q,
            answers: newAnswers,
            selectedAnswers: newSelectedAnswers,
          };
        }
        return q;
      })
    );
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("accessToken"); // Lấy đúng ID của tài khoản đang đăng nhập
    console.log(userId);

    if (!userId || !token) {
      console.error("Không tìm thấy userId trong localStorage");
      return;
    }
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    if (!window.confirm("Bạn có chắc muốn tạo và ôn luyện bộ câu hỏi này?")) {
      return;
    }

    const formattedQuestions = questions.map((q) => ({
      content: q.question,
      type:
        q.type === "trueFalse"
          ? "Boolean"
          : q.type === "multiAnswer"
          ? "MAQ"
          : "MCQ",
      answers: q.answers.map((ans, index) => ({
        answerContent: ans,
        isCorrect: q.selectedAnswers.includes(index),
      })),
    }));

    const payload = {
      name: title,
      description,
      arrayQuestion: formattedQuestions,
      createdBy: userId,
    };

    try {
      await axios.post("http://localhost:9999/questionFile/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm accessToken vào header
        },
      });
      toast.success("Tạo bộ câu hỏi thành công!", { autoClose: 4000 });
      setIsDirty(false);
      setTimeout(() => navigate("/questionfile/getAll"), 4000);
    } catch (error) {
      toast.error("Lỗi khi tạo bộ câu hỏi");
      console.error(error);
    }
  };

  const handleCreateAndPractice = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Bạn cần đăng nhập để tạo câu hỏi và ôn luyện"); // Chuyển hướng đến trang đăng nhập sau 2 giây
      return;
    }
    handleSubmit(); // Nếu đã đăng nhập, gọi hàm handleSubmit
  };

  const parseTxtFile = (fileContent) => {
    const lines = fileContent.split("\n").map((line) => line.trim());
    if (lines.length === 0 || lines.every((line) => !line)) {
      throw new Error("File .txt rỗng, vui lòng nhập nội dung.");
    }
  
    let name = "";
    let description = "";
    let isPrivate = false;
    const questions = [];
    let currentQuestion = null;
    const warnings = [];
    let startParsingQuestions = false;
  
    lines.forEach((line, index) => {
      // Xử lý metadata trước danh sách câu hỏi
      if (!startParsingQuestions) {
        if (line.startsWith("Chủ đề:")) {
          name = line.replace("Chủ đề:", "").trim();
        } else if (line.startsWith("Mô tả:")) {
          description = line.replace("Mô tả:", "").trim();
        } else if (line.startsWith("Công khai:")) {
          isPrivate = line.replace("Công khai:", "").trim() === "Không";
        } else if (line === "Danh sách câu hỏi:") {
          // Bắt đầu đọc câu hỏi từ dòng tiếp theo sau tiêu đề
          startParsingQuestions = true;
        } else if (line === "------------------------") {
          // Không làm gì, chỉ chờ dòng tiếp theo
        }
        return; // Bỏ qua các dòng khác cho đến khi gặp "Danh sách câu hỏi:"
      }
  
      // Chỉ xử lý câu hỏi sau khi đã gặp "Danh sách câu hỏi:" và "------------------------"
      if (line && (line.match(/^\d+\./) || (!line.match(/^[a-e]\./) && line.length > 0))) {
        if (currentQuestion) {
          if (currentQuestion.answers.length === 0) {
            warnings.push(`Câu hỏi "${currentQuestion.content}" không có đáp án.`);
          }
          questions.push(currentQuestion);
        }
        let cleanedLine = line.replace(/[@#$%]+/g, "").trim();
        if (!cleanedLine) {
          warnings.push(
            `Dòng ${index + 1}: Nội dung không hợp lệ (chỉ chứa ký tự đặc biệt).`
          );
          return;
        }
        const [questionText, type] = cleanedLine
          .split("(")
          .map((part) => part.trim());
        currentQuestion = {
          content: questionText.replace(/^\d+\.\s*/, "").trim() || cleanedLine.trim(),
          type:
            type && type.includes(")")
              ? type.replace(")", "").trim() === "Boolean"
                ? "Boolean"
                : type.replace(")", "").trim() === "MAQ"
                ? "MAQ"
                : "MCQ"
              : "MCQ",
          answers: [],
        };
      } else if (currentQuestion && line.match(/^[a-e]\./)) {
        let cleanedLine = line.replace(/[@#$%]+/g, "").trim();
        if (!cleanedLine) {
          warnings.push(
            `Dòng ${index + 1}: Đáp án không hợp lệ (chỉ chứa ký tự đặc biệt).`
          );
          return;
        }
        const [answerText, correctText] = cleanedLine
          .split("(")
          .map((part) => part.trim());
        const answerContent =
          answerText.replace(/^[a-e]\.\s*/, "").trim() || cleanedLine.trim();
        const isCorrect =
          correctText && correctText.includes(")")
            ? correctText.replace(")", "").trim() === "Đúng"
            : false;
        currentQuestion.answers.push({ answerContent, isCorrect });
      }
    });
  
    // Thêm câu hỏi cuối cùng nếu có
    if (currentQuestion) {
      if (currentQuestion.answers.length === 0) {
        warnings.push(`Câu hỏi "${currentQuestion.content}" không có đáp án.`);
      }
      questions.push(currentQuestion);
    }
  
    // Kiểm tra các trường bắt buộc
    if (!name) warnings.push("Thiếu trường 'Chủ đề'");
    if (!description) warnings.push("Thiếu trường 'Mô tả'");
    if (questions.length === 0)
      throw new Error("File .txt không chứa câu hỏi nào");
  
    return { name, description, isPrivate, arrayQuestion: questions, warnings };
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith(".txt")) {
      toast.error("File không đúng định dạng");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const parsedData = parseTxtFile(text);
        if (
          window.confirm(
            "Bạn có chắc muốn import file này? Hành động này sẽ tải dữ liệu lên giao diện."
          )
        ) {
          setTitle(parsedData.name || title);
          setDescription(parsedData.description || description);
          setQuestions(
            parsedData.arrayQuestion.map((q, index) => ({
              id: index + 1,
              type:
                q.type === "Boolean"
                  ? "trueFalse"
                  : q.type === "MAQ"
                  ? "multiAnswer"
                  : "singleAnswer",
              question: q.content,
              answers: q.answers.map((a) => a.answerContent),
              selectedAnswers: q.answers.reduce(
                (acc, a, idx) => (a.isCorrect ? [...acc, idx] : acc),
                []
              ),
            }))
          );
          setIsDirty(true);
          setCurrentPage(1); // Reset về trang đầu sau khi import
          if (parsedData.warnings.length > 0) {
            parsedData.warnings.forEach((warning) => toast.warn(warning));
          }
          toast.success("Import file thành công");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleImportClick = (event) => {
    event.preventDefault(); // Ngăn hành vi mặc định của label/input
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Bạn cần đăng nhập để tạo câu hỏi và ôn luyện"); // Chuyển hướng đến trang đăng nhập sau 2 giây
      return;
    }
    // Nếu đã đăng nhập, kích hoạt input file để mở cửa sổ chọn file
    fileInputRef.current.click();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Logic phân trang
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
      <ButtonContainer>
        <Title>Tạo học phần mới</Title>
      </ButtonContainer>
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
      <ImportButtonContainer>
        <label
          htmlFor="file-import"
          style={{ cursor: "pointer", display: "inline-block" }}
        >
          <PrimaryButton onClick={handleImportClick}>
            Import file txt
          </PrimaryButton>
        </label>
        <PrimaryButton onClick={openModal}>Hướng dẫn</PrimaryButton>
        <input
          id="file-import"
          type="file"
          accept=".txt"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileImport}
        />
      </ImportButtonContainer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            width: "700px",
            height: "500px",
            overflowX: "hidden",
            overflowY: "hidden",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          },
        }}
      >
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2>Hướng dẫn tạo file .txt</h2>
          <p>Định dạng file .txt để import bộ câu hỏi (có thể linh hoạt):</p>
          <ul>
            <li>
              <strong>Chủ đề:</strong> [Tên chủ đề]
            </li>
            <li>
              <strong>Mô tả:</strong> [Mô tả]
            </li>
            <li>
              <strong>Câu hỏi:</strong> [Số]. [Nội dung câu hỏi]
              ([Boolean/MAQ/MCQ]) hoặc chỉ [Nội dung câu hỏi]
            </li>
            <li>
              <strong>Đáp án:</strong> [a-e]. [Nội dung đáp án] ([Đúng/Sai])
              hoặc chỉ [Nội dung đáp án]
            </li>
          </ul>
          <p>
            <strong>Ví dụ định dạng chuẩn:</strong>
          </p>
          Chủ đề: Chủ đề địa lý thế giới <br></br>
          Mô tả: Các câu hỏi về địa lý trên toàn thế giới <br></br>
          1. Đâu là quốc gia có diện tích lớn nhất thế giới? (MCQ) <br></br>
          a. Hoa Kỳ (Sai) <br></br>
          b. Canada (Sai) <br></br>
          c. Nga (Đúng) <br></br>
          d. Trung Quốc (Sai) <br></br>
          .....
          <p>
            <strong>Ví dụ định dạng linh hoạt:</strong>
          </p>
          Chủ đề: Chủ đề địa lý thế giới <br></br>
          Mô tả: Các câu hỏi về địa lý trên toàn thế giới <br></br>
          Đâu là quốc gia có diện tích lớn nhất thế giới? (MCQ) <br></br>
          Hoa Kỳ<br></br>
          Canada <br></br>
          Nga <br></br>
          Trung Quốc <br></br>
          .....
          <p>
            <strong>Lưu file với định dạng .txt và import để sử dụng!</strong>
          </p>
        </ModalContent>
      </Modal>

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
                {question.answers.length > 2 && (
                  <DeleteButton
                    onClick={() => removeAnswer(question.id, index)}
                  >
                    <Trash2 size={16} />
                  </DeleteButton>
                )}
              </AnswerItem>
            ))}
          </AnswersGrid>
          <ButtonContainer>
            <AddButton onClick={() => addAnswer(question.id)}>
              <Plus size={20} />
              <span>Thêm đáp án</span>
            </AddButton>
            {questions.length > 1 && (
              <DeleteButtonWrapper>
                <DeleteButton onClick={() => removeQuestion(question.id)}>
                  <Trash2 size={20} />
                </DeleteButton>
              </DeleteButtonWrapper>
            )}
          </ButtonContainer>
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
        <SecondaryButton>Trở lại</SecondaryButton>
        <PrimaryButton onClick={handleCreateAndPractice}>
          Tạo và ôn luyện
        </PrimaryButton>
      </ButtonGroup>
    </Container>
  );
};

export default QuestionCreator;
