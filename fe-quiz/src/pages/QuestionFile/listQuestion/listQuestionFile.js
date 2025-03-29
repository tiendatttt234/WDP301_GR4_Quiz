import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        const token = localStorage.getItem("accessToken");
        if (!userId || !token) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:9999/questionFile/getAll/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Question Files Response:", response.data);
        setQuestionSets(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học phần", error);
        setQuestionSets([]);
      }
    };

    fetchQuestionFiles();
  }, []);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeTab !== "luuhocphan") return;

      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("accessToken");

        if (!userId || !token) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:9999/favorite/user/${userId}`, // Sửa URL để khớp với route
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Favorite Response:", JSON.stringify(response.data, null, 2));
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
            (file.createdBy?.userName || file.createdBy)?.toLowerCase().includes(search.toLowerCase())
        );

  const handleQuestionClick = (id) => {
    navigate(`/questionfile/getById/${id}`);
  };

  const handleUpdateClick = (id) => {
    navigate(`/questionfile/update/${id}`);
  };

  const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm(
      "Điều này sẽ làm mất toàn bộ câu hỏi? Bạn có muốn tiếp tục không?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
          return;
        }
        await axios.delete(`http://localhost:9999/questionFile/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestionSets(questionSets.filter((qf) => qf._id !== id));
        toast.success("Xóa học phần thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa học phần", error);
        toast.error("Lỗi khi xóa học phần!");
      }
    }
  };

  const handleCreateNewQuestionSet = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Bạn cần đăng nhập để tạo câu hỏi và ôn luyện");
      return;
    }
    navigate("/questionfile/create");
  };

  const handleDeleteFavorite = async (favoriteId, questionFileId) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa học phần này khỏi danh sách yêu thích không?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
          return;
        }

        await axios.delete(`http://localhost:9999/favorite/delete/${favoriteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { questionFileId }, // Gửi questionFileId trong body
        });
        setFavorites((prevFavorites) =>
          prevFavorites.map((fav) =>
            fav._id === favoriteId
              ? {
                  ...fav,
                  sharedQuestionFile: fav.sharedQuestionFile.filter(
                    (qf) => qf._id !== questionFileId
                  ),
                }
              : fav
          ).filter((fav) => fav.sharedQuestionFile.length > 0)
        );
        toast.success("Đã xóa khỏi danh sách yêu thích!");
      } catch (error) {
        console.error("Lỗi khi xóa favorite", error);
        toast.error("Lỗi khi xóa khỏi danh sách yêu thích!");
      }
    }
  };

  return (
    <Container>
      <ToastContainer />
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
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {activeTab === "hocPhan" ? (
            <>
              <p>Bạn hiện chưa có học phần, hãy tạo mới ngay!</p>
              <CreateButton onClick={handleCreateNewQuestionSet}>
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
            if (isFavorite) {
              // Lặp qua tất cả sharedQuestionFile trong favorite
              return item.sharedQuestionFile.map((qf) => (
                <QuestionItem key={qf._id}>
                  <div
                    onClick={() => handleQuestionClick(qf._id)}
                    style={{ cursor: "pointer", flex: 1 }}
                  >
                    <QuestionDetails>
                      <QuestionCount>
                        {qf.arrayQuestion?.length || 0} câu hỏi
                        {qf.createdBy?.userName && ` - ${qf.createdBy.userName}`}
                      </QuestionCount>
                    </QuestionDetails>
                    <QuestionTitle>{qf.name}</QuestionTitle>
                  </div>
                  <DeleteButton
                    onClick={() => handleDeleteFavorite(item._id, qf._id)}
                  >
                    <Trash2 size={20} />
                  </DeleteButton>
                </QuestionItem>
              ));
            } else {
              // Hiển thị questionSets như trước
              return (
                <QuestionItem key={item._id}>
                  <div
                    onClick={() => handleQuestionClick(item._id)}
                    style={{ cursor: "pointer", flex: 1 }}
                  >
                    <QuestionDetails>
                      <QuestionCount>
                        {item.arrayQuestion?.length || 0} câu hỏi
                        {(item.createdBy?.username || item.createdBy) && ` - ${item.createdBy?.username || item?.createdBy}`}
                      </QuestionCount>
                    </QuestionDetails>
                    <QuestionTitle>{item.name}</QuestionTitle>
                  </div>
                  <DeleteButton
                    onClick={() => handleUpdateClick(item._id)}
                    style={{ marginRight: "10px" }}
                  >
                    <Pencil size={20} />
                  </DeleteButton>
                  <DeleteButton onClick={() => handleDeleteQuestion(item._id)}>
                    <Trash2 size={20} />
                  </DeleteButton>
                </QuestionItem>
              );
            }
          })}
        </QuestionList>
      )}
    </Container>
  );
};

export default ListQuestion;