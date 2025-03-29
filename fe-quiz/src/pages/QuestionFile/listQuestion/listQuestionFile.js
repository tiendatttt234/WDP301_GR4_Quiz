// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify"; // Thêm ToastContainer và toast
// import "react-toastify/dist/ReactToastify.css";
// import { Search, Trash2, Pencil } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Header,
//   Title,
//   TabMenu,
//   Tab,
//   SearchBox,
//   SearchInput,
//   SearchIcon,
//   QuestionList,
//   QuestionItem,
//   QuestionTitle,
//   QuestionCount,
//   QuestionDetails,
//   DeleteButton,
//   CreateButton,
// } from "./styles";

// const ListQuestion = () => {
//   const [activeTab, setActiveTab] = useState("hocPhan");
//   const [search, setSearch] = useState("");
//   const [questionSets, setQuestionSets] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const navigate = useNavigate();

//   // Fetch question files
//   useEffect(() => {
//     const fetchQuestionFiles = async () => {
//       try {
//         const userId = localStorage.getItem("id");
//         const token = localStorage.getItem("accessToken");
//         if (!userId || !token) {
//           console.error("Không tìm thấy userId trong localStorage");
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:9999/questionFile/getAll/${userId}`, // Sửa URL để khớp với route
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Thêm token vào header
//             },
//           }
//         );
//         console.log("API Response:", response.data);
//         setQuestionSets(response.data.data || []);
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách học phần", error);
//         setQuestionSets([]);
//       }
//     };

//     fetchQuestionFiles();
//   }, []);

//   // Fetch favorites when switching to "luuhocphan" tab
//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (activeTab !== "luuhocphan") return;

//       try {
//         const userId = localStorage.getItem("id");
//         const token = localStorage.getItem("accessToken");

//         if (!userId || !token) {
//           console.error("Không tìm thấy userId trong localStorage");
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:9999/favorite/user/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Thêm token vào header
//             },
//           }
//         );
//         console.log("Favorite Response:", JSON.stringify(response.data, null, 2));
//         setFavorites(response.data.data || []);
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách favorite", error);
//         setFavorites([]);
//       }
//     };

//     fetchFavorites();
//   }, [activeTab]);

//   // Filter based on active tab
//   const filteredItems =
//     activeTab === "luuhocphan"
//       ? favorites.filter((favorite) =>
//           favorite.sharedQuestionFile.some((qf) =>
//             qf.name.toLowerCase().includes(search.toLowerCase())
//           )
//         )
//       : questionSets.filter(
//           (file) =>
//             file.name.toLowerCase().includes(search.toLowerCase()) ||
//             (file.createdBy && file.createdBy.toLowerCase().includes(search.toLowerCase()))
//         );

//   const handleQuestionClick = (id) => {
//     if (activeTab === "luuhocphan") {
//       navigate(`/questionfile/getById/${id}`);
//     } else {
//       navigate(`/questionfile/getById/${id}`);
//     }
//   };

//   const handleUpdateClick = (id) =>  {
//     navigate(`/questionfile/update/${id}`);
//   }

//   const handleDeleteQuestion = async (id) => {
//     const confirmDelete = window.confirm(
//       "Điều này sẽ làm mất toàn bộ câu hỏi? Bạn có muốn tiếp tục không?"
//     );
//     if (confirmDelete) {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
//           return;
//         }
//         await axios.delete(`http://localhost:9999/questionFile/delete/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setQuestionSets(questionSets.filter((qf) => qf._id !== id));
//         alert("Xóa học phần thành công!");
//       } catch (error) {
//         console.error("Lỗi khi xóa học phần", error);
//         alert("Lỗi khi xóa học phần!");
//       }
//     }
//   };
//   const handleCreateNewQuestionSet = () => {
//     const token = localStorage.getItem("accessToken"); // Sử dụng accessToken
//     if (!token) {
//       toast.error("Bạn cần đăng nhập để tạo câu hỏi và ôn luyện"); // Chuyển hướng đến trang đăng nhập sau 2 giây
//       return;
//     }
//     navigate("/questionfile/create"); // Nếu đã đăng nhập, chuyển hướng đến trang tạo học phần
//   };

//   const handleDeleteFavorite = async (favoriteId, questionFileId) => {
//     const confirmDelete = window.confirm(
//       "Bạn có muốn xóa học phần này khỏi danh sách yêu thích không?"
//     );
//     if (confirmDelete) {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
//           return;
//         }

//         await axios.delete(`http://localhost:9999/favorite/delete/${favoriteId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           data: { questionFileId }
//         });
//         setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
//         alert("Đã xóa khỏi danh sách yêu thích!");
//       } catch (error) {
//         console.error("Lỗi khi xóa favorite", error);
//         alert("Lỗi khi xóa khỏi danh sách yêu thích!");
//       }
//     }
//   };

//   return (
//     <Container>
//       <ToastContainer />
//       <Header>
//         <Title>Thư viện của bạn</Title>
//         <TabMenu>
//           <Tab
//             active={activeTab === "hocPhan"}
//             onClick={() => setActiveTab("hocPhan")}
//           >
//             Học phần
//           </Tab>
//           <Tab
//             active={activeTab === "baiKiemTra"}
//             onClick={() => setActiveTab("baiKiemTra")}
//           >
//             Bài kiểm tra thử
//           </Tab>
//           <Tab
//             active={activeTab === "luuhocphan"}
//             onClick={() => setActiveTab("luuhocphan")}
//           >
//             Học phần đã lưu
//           </Tab>
//         </TabMenu>
//         <SearchBox>
//           <SearchInput
//             type="text"
//             placeholder="Tìm kiếm theo tên học phần hoặc tác giả..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <SearchIcon>
//             <Search size={20} />
//           </SearchIcon>
//         </SearchBox>
//       </Header>
//       {filteredItems.length === 0 ? (
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//           {activeTab === "hocPhan" ? (
//             <>
//               <p>Bạn hiện chưa có học phần, hãy tạo mới ngay!</p>
//               <CreateButton onClick={handleCreateNewQuestionSet}>
//                 Tạo học phần mới
//               </CreateButton>
//             </>
//           ) : activeTab === "luuhocphan" ? (
//             <p>Bạn hiện chưa có học phần nào được lưu!</p>
//           ) : (
//             <p>Chưa có bài kiểm tra thử nào!</p>
//           )}
//         </div>
//       ) : (
//         <QuestionList>
//           {filteredItems.map((item) => {
//             const isFavorite = activeTab === "luuhocphan";
//             const qf = isFavorite ? item.sharedQuestionFile : item;
//             console.log(qf);

//             return (
//               <QuestionItem key={qf._id}>
//                 <div
//                   onClick={() => handleQuestionClick(qf._id)}
//                   style={{ cursor: "pointer", flex: 1 }}
//                 >
//                   <QuestionDetails>
//                     <QuestionCount>
//                       {qf.arrayQuestion?.length} câu hỏi
//                       {qf.createdBy?.userName &&` - ${qf.createdBy.userName}`}{" "}
//                       {/* Hiển thị username người tạo QuestionFile */}
//                     </QuestionCount>
//                   </QuestionDetails>
//                   <QuestionTitle>{qf.name}</QuestionTitle>
//                 </div>
//                 {!isFavorite && (
//                   <DeleteButton
//                     onClick={() => handleUpdateClick(qf._id)}
//                     style={{ marginRight: "10px" }}
//                   >
//                     <Pencil size={20} />
//                   </DeleteButton>
//                 )}
//                 <DeleteButton
//                   onClick={() =>
//                     isFavorite
//                       ? handleDeleteFavorite(item._id)
//                       : handleDeleteQuestion(qf._id)
//                   }
//                 >
//                   <Trash2 size={20} />
//                 </DeleteButton>
//               </QuestionItem>
//             );
//           })}
//         </QuestionList>
//       )}
//     </Container>
//   );
// };

// export default ListQuestion;

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
  Trophy,
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
  const [quizResults, setQuizResults] = useState([]);
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

  //fetch quiz results
  useEffect(() => {
    const fetchQuizResults = async () => {
      if (activeTab !== "ketQuaQuiz") return;

      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("accessToken");

        if (!userId || !token) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:9999/quiz/result/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Quiz Results Response:", response.data);
        setQuizResults(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy kết quả quiz", error);
        setQuizResults([]);
      }
    };

    fetchQuizResults();
  }, [activeTab]);

  // Filter based on active tab
  const filteredItems = () => {
    if (activeTab === "luuhocphan") {
      return favorites.filter((favorite) =>
        favorite.sharedQuestionFile.some((qf) =>
          qf.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else if (activeTab === "ketQuaQuiz") {
      return quizResults.filter((result) =>
        result.quizId.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return questionSets.filter(
        (file) =>
          file.name.toLowerCase().includes(search.toLowerCase()) ||
          (file.createdBy?.userName || file.createdBy)?.toLowerCase().includes(search.toLowerCase())
      );
    }
  };
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

  // Format date for quiz results
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group quiz results by quizId
  const groupedQuizResults = quizResults.reduce((acc, result) => {
    if (!acc[result.quizId]) {
      acc[result.quizId] = [];
    }
    acc[result.quizId].push(result);
    return acc;
  }, {});

  return (
    <Container>
      <ToastContainer />
      <Header>
        <Title>Thư viện của bạn</Title>
        <TabMenu>
          <Tab active={activeTab === "hocPhan"} onClick={() => setActiveTab("hocPhan")}>
            Học phần
          </Tab>
          <Tab active={activeTab === "ketQuaQuiz"} onClick={() => setActiveTab("ketQuaQuiz")}>
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
      {activeTab === "ketQuaQuiz" ? (
        <QuestionList>
          {quizResults.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p>Bạn chưa thực hiện bài kiểm tra nào!</p>
            </div>
          ) : (
            Object.entries(
              quizResults.reduce((acc, result) => {
                const quizId = result.quizId._id;
                if (!acc[quizId]) {
                  acc[quizId] = {
                    quizName: result.quizId.quizName,
                    results: []
                  };
                }
                acc[quizId].results.push(result);
                return acc;
              }, {})
            ).map(([quizId, { quizName, results }]) => (
              <QuestionItem key={quizId}>
                <div style={{ flex: 1 }}>
                  <QuestionTitle>Bài kiểm tra: {quizName}</QuestionTitle>
                  <QuestionDetails>
                    <QuestionCount>
                      <Trophy size={16} style={{ marginRight: "5px", color: "#FFD700" }} />
                      {results.length} lần thực hiện | Điểm cao nhất: {
                        Math.max(...results.map(r => r.correctAnswersCount))
                      } câu đúng
                    </QuestionCount>
                    <div>Thực hiện gần nhất: {formatDate(results[results.length - 1].createdAt)}</div>
                  </QuestionDetails>
                </div>
              </QuestionItem>
            ))
          )}
        </QuestionList>
      ) : filteredItems().length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {activeTab === "hocPhan" ? (
            <>
              <p>Bạn hiện chưa có học phần, hãy tạo mới ngay!</p>
              <CreateButton onClick={handleCreateNewQuestionSet}>
                Tạo học phần mới
              </CreateButton>
            </>
          ) : (
            <p>Bạn hiện chưa có học phần nào được lưu!</p>
          )}
        </div>
      ) : (
        <QuestionList>
          {filteredItems().map((item) => {
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