import { Route, Routes } from "react-router-dom";
// import QuizAttempt from "../../user/QuizAttempt";
// import QuizResults from "../../user/QuizResult";
// import AddQuestion from "../../user/question/AddQues";
// import ViewQuestionDetail from "../../user/question/ViewQuesDetail";
// import EditQuestion from "../../user/question/UpdateQuestion";
// import ViewQuestion from "../../user/question/ViewQues";
import QuestionCreation from "../pages/QuestionFile/newQuestionFile";
import UpdateQuestion from "../pages/QuestionFile/update/updateQuestionFile";
import ListQuestion from "../pages/QuestionFile/listQuestion/listQuestionFile";
import QuestionFileDetail from "../pages/QuestionFile/detail/questionFileDetail";
// import FlashCardPage from "../../user/FlashCard";
// import Profile from "../../authen/Profile";
// import MyCourse from "../../authen/MyCourse";

export default function UserDefaultPage() {
  return (
    <div className="container-fluid">
      {/* <Header/> */}
      <div className="container-fluid">
        <div className={`container-fluid `}>
          <Routes>
            {/* Làm quiz */}
            {/* <Route path="/quiz/attempt/:id" element={<QuizAttempt />} />
            <Route path="/quiz-result" element={<QuizResults />} /> */}

            {/* Chỉnh sửa tệp câu hỏi  */}
            {/* <Route path='/flash' element={FlashCardPage}/> */}
            <Route path="/questionfile/create" element={<QuestionCreation />} />
            <Route path="/questionfile/getAll" element={<ListQuestion />} />
            <Route path="/questionfile/getById/:id" element={<QuestionFileDetail />} />
            <Route path="/questionfile/update/:id" element={<UpdateQuestion />} />
            <Route path="/questionfile/update" element={<UpdateQuestion />} />
            

            {/* user profile */}
            {/* <Route path="/profile" element={<Profile />} />
            <Route path="/mycourse" element={<MyCourse />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}
