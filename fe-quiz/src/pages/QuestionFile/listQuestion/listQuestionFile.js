import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2, Pencil } from "lucide-react";
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
  QuestionCount,
  QuestionDetails,
  DeleteButton,
  CreateButton,
} from "./styles";

const ListQuestion = () => {
  const [activeTab, setActiveTab] = useState("hocPhan");
  const [search, setSearch] = useState("");
  const [questionSets, setQuestionSets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Fetch question files
  useEffect(() => {
    const fetchQuestionFiles = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:9999/questionFile/getAll/${userId}`
        );
        console.log("API Response:", response.data);
        setQuestionSets(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học phần", error);
        setQuestionSets([]);
      }
    };

    fetchQuestionFiles();
  }, []);

  // Fetch favorites when switching to "luuhocphan" tab
  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeTab !== "luuhocphan") return;

      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:9999/favorite/user/${userId}`
        );
        console.log("Favorite Response:", response.data);
        setFavorites(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách favorite", error);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [activeTab]);

  // Filter based on active tab
  const filteredItems =
    activeTab === "luuhocphan"
      ? favorites.filter((favorite) =>
          favorite.sharedQuestionFile.some((qf) =>
            qf.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      : questionSets.filter(
          (file) =>
            file.name.toLowerCase().includes(search.toLowerCase()) ||
            (file.createdBy && file.createdBy.toLowerCase().includes(search.toLowerCase()))
        );

  const handleQuestionClick = (id) => {
    if (activeTab === "luuhocphan") {
      navigate(`/questionfile/getById/${id}`);
    } else {
      navigate(`/questionfile/getById/${id}`);
    }
  };

  const handleUpdateClick = (id) =>  {
    navigate(`/questionfile/update/${id}`);
  }

  const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm(
      "Điều này sẽ làm mất toàn bộ câu hỏi? Bạn có muốn tiếp tục không?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:9999/questionFile/delete/${id}`);
        setQuestionSets(questionSets.filter((qf) => qf._id !== id));
        alert("Xóa học phần thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa học phần", error);
        alert("Lỗi khi xóa học phần!");
      }
    }
  };

  const handleDeleteFavorite = async (favoriteId) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa học phần này khỏi danh sách yêu thích không?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:9999/favorite/${favoriteId}`);
        setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
        alert("Đã xóa khỏi danh sách yêu thích!");
      } catch (error) {
        console.error("Lỗi khi xóa favorite", error);
        alert("Lỗi khi xóa khỏi danh sách yêu thích!");
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Thư viện của bạn</Title>
        <TabMenu>
          <Tab
            active={activeTab === "hocPhan"}
            onClick={() => setActiveTab("hocPhan")}
          >
            Học phần
          </Tab>
          <Tab
            active={activeTab === "baiKiemTra"}
            onClick={() => setActiveTab("baiKiemTra")}
          >
            Bài kiểm tra thử
          </Tab>
          <Tab
            active={activeTab === "luuhocphan"}
            onClick={() => setActiveTab("luuhocphan")}
          >
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
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {activeTab === "hocPhan" ? (
            <>
              <p>Bạn hiện chưa có học phần, hãy tạo mới ngay!</p>
              <CreateButton onClick={() => navigate("/questionfile/create")}>
                Tạo học phần mới
              </CreateButton>
            </>
          ) : activeTab === "luuhocphan" ? (
            <p>Bạn hiện chưa có học phần nào được lưu!</p>
          ) : (
            <p>Chưa có bài kiểm tra thử nào!</p>
          )}
        </div>
      ) : (
        <QuestionList>
          {filteredItems.map((item) => {
            const isFavorite = activeTab === "luuhocphan";
            const qf = isFavorite ? item.sharedQuestionFile[0] : item;
            console.log(qf);
            
            return (
              <QuestionItem key={qf._id}>
                <div
                  onClick={() => handleQuestionClick(qf._id)}
                  style={{ cursor: "pointer", flex: 1 }}
                >
                  <QuestionDetails>
                    <QuestionCount>
                      {qf.arrayQuestion?.length} câu hỏi
                      {qf.createdBy?.userName &&` - ${qf.createdBy.userName}`}{" "}
                      {/* Hiển thị username người tạo QuestionFile */}
                    </QuestionCount>
                  </QuestionDetails>
                  <QuestionTitle>{qf.name}</QuestionTitle>
                </div>
                <DeleteButton
                    onClick={() => handleUpdateClick(qf._id)}
                    style={{ marginRight: "10px" }}
                  >
                    <Pencil size={20} />
                </DeleteButton>
                <DeleteButton
                  onClick={() =>
                    isFavorite
                      ? handleDeleteFavorite(item._id)
                      : handleDeleteQuestion(qf._id)
                  }
                >
                  <Trash2 size={20} />
                </DeleteButton>
              </QuestionItem>
            );
          })}
        </QuestionList>
      )}
    </Container>
  );
};

export default ListQuestion;
