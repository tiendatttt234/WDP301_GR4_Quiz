import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2 } from "lucide-react"; // Thêm Trash2 vào import
import { useNavigate } from "react-router-dom";
import {
  Container,
  Header,
  Title,
  TabMenu,
  Tab,
  SearchBox,
  SearchInput,
  SearchIcon,
  QuestionList,
  QuestionItem,
  QuestionTitle,
  QuestionAuthor,
  QuestionCount,
  QuestionDetails,
  DeleteButton, 
  CreateButton// Thêm DeleteButton vào import
} from "./styles";

const ListQuestion = () => {
  const [activeTab, setActiveTab] = useState("hocPhan");
  const [search, setSearch] = useState("");
  const [questionSets, setQuestionSets] = useState([]);
  const navigate = useNavigate();

  // const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchQuestionFiles = async () => {
      try {
        const userId = localStorage.getItem("id"); // Lấy đúng ID của tài khoản đang đăng nhập
        console.log(userId);
        
        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }
  
        const response = await axios.get(`http://localhost:9999/questionFile/getAll/${userId}`);
        console.log("API Response:", response.data);
  
        setQuestionSets(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học phần", error);
        setQuestionSets([]);
      }
    };
  
    fetchQuestionFiles();
  }, []);
  
  

  const filteredQuestionFiles = questionSets.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase()) ||
    (file.createdBy && file.createdBy.toLowerCase().includes(search.toLowerCase()))
  );

  const handleQuestionClick = (id) => {
    navigate(`/questionfile/update/${id}`);
  };

  const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm(
      "Điều này sẽ làm mất toàn bộ câu hỏi? Bạn có muốn tiếp tục không?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:9999/questionFile/delete/${id}`);
        setQuestionSets(questionSets.filter((qf) => qf._id !== id)); // Cập nhật danh sách sau khi xóa
        alert("Xóa học phần thành công!"); // Thông báo thành công (có thể thay bằng toast nếu muốn)
      } catch (error) {
        console.error("Lỗi khi xóa học phần", error);
        alert("Lỗi khi xóa học phần!");
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Thư viện của bạn</Title>
        <TabMenu>
          <Tab active={activeTab === "hocPhan"} onClick={() => setActiveTab("hocPhan")}>
            Học phần
          </Tab>
          <Tab active={activeTab === "baiKiemTra"} onClick={() => setActiveTab("baiKiemTra")}>
            Bài kiểm tra thử
          </Tab>
          <Tab active={activeTab === "luuhocphan"} onClick={() => setActiveTab("luuhocphan")}>
            Học phần đã lưu
          </Tab>
        </TabMenu>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm theo tên học phần hoặc tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
        </SearchBox>
      </Header>
      {filteredQuestionFiles.length === 0 ? (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <p>Bạn hiện chưa có học phần, hãy tạo mới ngay!</p>
    <CreateButton onClick={() => navigate("/questionfile/create")}>
      Tạo học phần mới
    </CreateButton>
  </div>
) : (
  <QuestionList>
    {filteredQuestionFiles.map((qf) => (
      <QuestionItem key={qf._id}>
        <div
          onClick={() => handleQuestionClick(qf._id)}
          style={{ cursor: "pointer", flex: 1 }}
        >
          <QuestionDetails>
            <QuestionCount>{qf.arrayQuestion?.length} câu hỏi</QuestionCount>
            {/* <QuestionAuthor>{qf.createdBy || "Không rõ"}</QuestionAuthor> */}
          </QuestionDetails>
          <QuestionTitle>{qf.name}</QuestionTitle>
        </div>
        <DeleteButton onClick={() => handleDeleteQuestion(qf._id)}>
          <Trash2 size={20} />
        </DeleteButton>
      </QuestionItem>
    ))}
  </QuestionList>
)}
    </Container>
  );
};

export default ListQuestion;