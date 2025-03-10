import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
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
} from "./styles";

const ListQuestion = () => {
  const [activeTab, setActiveTab] = useState("hocPhan");
  const [search, setSearch] = useState("");
  const [questionSets, setQuestionSets] = useState([]);
  // Danh sách học phần

  useEffect(() => {
    const fetchQuestionFiles = async () => {
      try {
        const response = await axios.get("http://localhost:9999/questionFile/getAll");
        console.log("API Response:", response.data);
        setQuestionSets(response.data.questionFileRespone || []); // Lưu danh sách học phần
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học phần", error);
        setQuestionSets([]); // Đảm bảo không bị lỗi khi API thất bại
      }
    };
    fetchQuestionFiles();
  }, []);
  

  // Lọc theo name (tên học phần) hoặc createdBy (nếu API có chứa thông tin tác giả)
  const filteredQuestionFiles = questionSets.filter(file =>
    file.name.toLowerCase().includes(search.toLowerCase()) ||
    (file.createdBy && file.createdBy.toLowerCase().includes(search.toLowerCase()))
  );



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
      <QuestionList>
        {filteredQuestionFiles.map((qf) => (
          <QuestionItem key={qf._id}>
            <QuestionDetails>
              <QuestionCount>{qf.arrayQuestion?.length} câu hỏi</QuestionCount>
              <QuestionAuthor>{qf.createdBy || "Không rõ"}</QuestionAuthor>
            </QuestionDetails>
            <QuestionTitle>{qf.name}</QuestionTitle>
          </QuestionItem>
        ))}
      </QuestionList>
    </Container>
  );
};

export default ListQuestion;
