// QuestionFileDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookMarked, AlertTriangle, BookmarkX } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Title,
  Answer,
  Container,
  Description,
  ErrorMessage,
  Header,
  QuestionCard,
  QuestionContent,
  TypeLabel,
  Pagination,
  HeaderActions,
  HeaderTitleWrapper,
} from "./styles.js";
import ReportModal from "./reportModal.js";

const QUESTIONS_PER_PAGE = 30;

const QuestionFileDetail = () => {
  const { id } = useParams();
  const [questionFile, setQuestionFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isOwnQuestionFile, setIsOwnQuestionFile] = useState(false);

  useEffect(() => {
    const fetchQuestionFile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/questionFile/getById/${id}`
        );
        const fetchedQuestionFile = response.data.questionFile;

        setQuestionFile(fetchedQuestionFile);
        setError(null);

        const currentUserId = localStorage.getItem("id");
        const ownId = response.data.questionFile?.createBy;
        console.log("currentID " + currentUserId);
        console.log(ownId);

        setIsOwnQuestionFile(currentUserId === ownId ? true : false);

        if (currentUserId && !isOwnQuestionFile) {
          const favoriteResponse = await axios.get(
            `http://localhost:9999/favorite/user/${currentUserId}`
          );
          const existingFavorite = favoriteResponse.data.data.find(fav => 
            fav.sharedQuestionFile.some(qf => qf._id === id)
          );
          
          if (existingFavorite) {
            setIsSaved(true);
            setFavoriteId(existingFavorite._id);
          }
        }
      } catch (err) {
        setError("Không thể tải dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionFile();
  }, [id]);

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case "MCQ":
        return "Trắc nghiệm một lựa chọn";
      case "MAQ":
        return "Trắc nghiệm nhiều lựa chọn";
      case "Boolean":
        return "Đúng/Sai";
      default:
        return type;
    }
  };

  if (loading)
    return (
      <Container>
        <ErrorMessage>Đang tải...</ErrorMessage>
      </Container>
    );
  if (error)
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  if (!questionFile) return null;

  // Logic phân trang
  const totalQuestions = questionFile.arrayQuestion.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = questionFile.arrayQuestion.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );
  console.log(paginatedQuestions);

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Vui lòng đăng nhập để lưu học phần");
        return;
      }

      const favoriteData = {
        user: userId,
        sharedQuestionFile: [id]
      };

      const response = await axios.post(
        "http://localhost:9999/favorite/create",
        favoriteData
      );
      
      setIsSaved(true);
      setFavoriteId(response.data.data._id);
      toast.success("Đã lưu học phần thành công!");
    } catch (error) {
      toast.error("Lỗi khi lưu học phần ");
    }
  };

  const handleUnsave = async () => {
    try {
      await axios.delete(`http://localhost:9999/favorite/delete/${favoriteId}`);
      setIsSaved(false);
      setFavoriteId(null);
      toast.success("Đã hủy lưu học phần thành công!");
    } catch (error) {
      toast.error("Lỗi khi hủy lưu học phần");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Container>
      <Header>
        <HeaderTitleWrapper>
          <Title>{questionFile.name}</Title>
          {!isOwnQuestionFile && (
            <HeaderActions>
              <button onClick={isSaved ? handleUnsave : handleSave}>
                {isSaved ? (
                  <>
                    <BookmarkX size={20} color="rgb(96, 99, 103)" />
                    <span>Hủy lưu</span>
                  </>
                ) : (
                  <>
                    <BookMarked size={20} color="rgb(96, 99, 103)" />
                    <span>Lưu</span>
                  </>
                )}
              </button>
              <button onClick={openModal}>
                <AlertTriangle size={20} color="#f39c12" />
                <span>Báo cáo</span>
              </button>
            </HeaderActions>
          )}
        </HeaderTitleWrapper>
        <Description>{questionFile.description}</Description>
        {/* <Description>Trạng thái: {questionFile.isPrivate ? 'Riêng tư' : 'Công khai'}</Description> */}
      </Header>

      <ReportModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        questionFileId={id}
      />

      {paginatedQuestions.map((question) => (
        <QuestionCard key={question.questionId}>
          <QuestionContent>{question.content}</QuestionContent>
          <TypeLabel>
            Loại câu hỏi: {getQuestionTypeLabel(question.type)}
          </TypeLabel>
          {question.answers.map((answer) => (
            <Answer key={answer.answerId} isCorrect={answer.isCorrect}>
              {answer.answerContent}
            </Answer>
          ))}
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
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default QuestionFileDetail;
