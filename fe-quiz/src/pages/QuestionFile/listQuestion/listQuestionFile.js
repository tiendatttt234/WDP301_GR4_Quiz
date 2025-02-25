import React, { useState } from "react";
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
  QuestionDetails
} from "./styles";

const ListQuestion = () => {
  const [activeTab, setActiveTab] = useState("hocPhan");
  const [search, setSearch] = useState("");
  const questions = [
    { id: 1, title: "SE_Kỳ 1_CSI104", author: "KandalsMe", count: 302 },
    { id: 2, title: "SWD391 - Test1", author: "Trần Thị B", count: 40 },
  ];

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.author.toLowerCase().includes(search.toLowerCase())
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
        {filteredQuestions.map((q) => (
          <QuestionItem key={q.id}>
            <QuestionDetails>
              <QuestionCount>{q.count} thuật ngữ</QuestionCount>
              <QuestionAuthor>{q.author}</QuestionAuthor>
            </QuestionDetails>
            <QuestionTitle>{q.title}</QuestionTitle>
          </QuestionItem>
        ))}
      </QuestionList>
    </Container>
  );
};

export default ListQuestion;
