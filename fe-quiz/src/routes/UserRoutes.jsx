// userRoutes.js
import QuestionCreation from "../pages/QuestionFile/newQuestionFile";
import UpdateQuestion from "../pages/QuestionFile/update/updateQuestionFile";
import ListQuestion from "../pages/QuestionFile/listQuestion/listQuestionFile";
import QuestionFileDetail from "../pages/QuestionFile/detail/questionFileDetail";
import HomePage from "../pages/Homepage/Homepage";
import FlashCards from "../pages/Quiz/FlashCard/FlashCards";
import QuizAttempt from "../pages/Quiz/QuizAttempt/QuizAttempt";
import QuizResult from "../pages/Quiz/QuizResult/QuizResult";
import Profile from "../components/authen/Profile/Profile";
import Login from "../components/authen/Login/Login";
import Register from "../components/authen/Register/Register";
import ForgotPassword from "../components/authen/forgotPassword/ForgotPassword";
import ResetPass from "../components/authen/forgotPassword/ResetPassword";


export const userRoutes = [
    { path: "", element: <HomePage /> },
    { path: "flashcards", element: <FlashCards /> }, 
    { path: "attempt/:id", element: <QuizAttempt /> }, 
    { path: "result", element: <QuizResult /> }, 
    { path: "profile/:id", element: <Profile /> }, 
    { path: "questionfile/create", element: <QuestionCreation /> },
    { path: "questionfile/getAll", element: <ListQuestion /> }, 
    { path: "questionfile/getById/:id", element: <QuestionFileDetail /> },
    { path: "questionfile/update/:id", element: <UpdateQuestion /> },
    { path: "questionfile/update", element: <UpdateQuestion /> }, 
    { path: "login", element: <Login/> },
    { path: "register", element: <Register/> },
    { path: "forgot-password", element: <ForgotPassword/> },
    { path: "reset-password/:id/:token", element: <ResetPass/>}
  ];