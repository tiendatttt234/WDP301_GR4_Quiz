<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Title,
    Answer,Container,Description,ErrorMessage,Header,QuestionCard,QuestionContent,TypeLabel
} from './styles.js'
import FlashcardList from '../../Quiz/FlashCard/FlashCards.jsx';
=======
// QuestionFileDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookMarked, AlertTriangle, BookmarkX, FileText } from "lucide-react"; // Added FileText for quiz icon
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flashcards from "../../Quiz/FlashCard/FlashCards.jsx";
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
import QuizCreationModal from "../../Quiz/QuizCreateModal/QuizCreationModal.jsx"

const QUESTIONS_PER_PAGE = 30;
>>>>>>> Stashed changes

const QuestionFileDetail = () => {
  const { id } = useParams();
  const [questionFile, setQuestionFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< Updated upstream
=======
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false); // New state for quiz modal
  const [isSaved, setIsSaved] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isOwnQuestionFile, setIsOwnQuestionFile] = useState(false);
>>>>>>> Stashed changes

  useEffect(() => {
    const fetchQuestionFile = async () => {
      try {
<<<<<<< Updated upstream
        const response = await axios.get(`http://localhost:9999/questionFile/getById/${id}`);
        setQuestionFile(response.data.questionFile);
        console.log(response.data.questionFile);
        setError(null);
=======
        const response = await axios.get(
          `http://localhost:9999/questionFile/getById/${id}`
        );
        const fetchedQuestionFile = response.data.questionFile;
        console.log(fetchedQuestionFile);

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
          const existingFavorite = favoriteResponse.data.data.find((fav) =>
            fav.sharedQuestionFile.some((qf) => qf._id === id)
          );

          if (existingFavorite) {
            setIsSaved(true);
            setFavoriteId(existingFavorite._id);
          }
        }
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  return (
    <Container>
      <Header>
        <Title>{questionFile.name}</Title>
        <Description>{questionFile.description}</Description>
        <Description>Trạng thái: {questionFile.isPrivate ? 'Riêng tư' : 'Công khai'}</Description>
      </Header>
      <FlashcardList questionFile={questionFile} />
      {questionFile.arrayQuestion.map((question) => (
=======
  const totalQuestions = questionFile.arrayQuestion.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = questionFile.arrayQuestion.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Vui lòng đăng nhập để lưu học phần");
        return;
      }

      const favoriteData = {
        user: userId,
        sharedQuestionFile: [id],
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
  const openQuizModal = () => setIsQuizModalOpen(true); // Function to open quiz modal
  const closeQuizModal = () => setIsQuizModalOpen(false); // Function to close quiz modal

  return (
    <Container>
      <Header>
        <HeaderTitleWrapper>
          <Title>{questionFile.name}</Title>
          <HeaderActions>
            {!isOwnQuestionFile && (
              <>
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
              </>
            )}
            <button onClick={openQuizModal}>
              <FileText size={20} color="rgb(96, 99, 103)" />
              <span>Tạo bài quiz</span>
            </button>
          </HeaderActions>
        </HeaderTitleWrapper>
        <Description>{questionFile.description}</Description>
      </Header>

      <Flashcards questionFile={questionFile} />

      <ReportModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        questionFileId={id}
      />

      <QuizCreationModal
        isOpen={isQuizModalOpen}
        onRequestClose={closeQuizModal}
        questionFileId={id}
      />

      {paginatedQuestions.map((question) => (
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
    </Container>
  );
};

export default QuestionFileDetail;