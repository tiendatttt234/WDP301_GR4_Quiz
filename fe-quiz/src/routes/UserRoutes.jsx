import QuestionCreation from "../pages/QuestionFile/create/newQuestionFile";
import UpdateQuestion from "../pages/QuestionFile/update/updateQuestionFile";
import ListQuestion from "../pages/QuestionFile/listQuestion/listQuestionFile";
import QuestionFileDetail from "../pages/QuestionFile/detail/questionFileDetail";
import StudySession from "../pages/QuestionFile/study/StudySession";
import HomePage from "../pages/Homepage/Homepage";
import QuizAttempt from "../pages/Quiz/QuizAttempt/QuizAttempt";
import QuizResult from "../pages/Quiz/QuizResult/QuizResult";
import Profile from "../components/authen/Profile/Profile";
import Login from "../components/authen/Login/Login";
import Register from "../components/authen/Register/Register";
import ForgotPassword from "../components/authen/forgotPassword/ForgotPassword";
import ResetPassword from "../components/authen/forgotPassword/ResetPassword";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import UpgradePage from "../pages/Upgrade/UpgradePage";
import QuestionFileByUser from "../pages/QuestionFile/findbyuser/QuestionFileByUser";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import UnauthorizedPage from "../pages/NotFound/UnauthorizedPage";

// Define routes with authentication requirements
export const userRoutes = [
    // Public routes (no authentication required)
    { path: "", element: <HomePage />, requiresAuth: false },
    { path: "login", element: <Login/>, requiresAuth: false },
    { path: "register", element: <Register/>, requiresAuth: false },
    { path: "forgot-password", element: <ForgotPassword/>, requiresAuth: false },
    { path: "reset-password/:id/:token", element: <ResetPassword/>, requiresAuth: false },
    
    // Protected routes (authentication required)
    { path: "attempt/:id", element: <QuizAttempt />, requiresAuth: true }, 
    { path: "quiz/result", element: <QuizResult />, requiresAuth: true }, 
    { path: "profile/:id", element: <Profile />, requiresAuth: true }, 
    { path: "questionfile/create", element: <QuestionCreation />, requiresAuth: true },
    { path: "questionfile/getAll", element: <ListQuestion />, requiresAuth: true }, 
    { path: "questionfile/getById/:id", element: <QuestionFileDetail />, requiresAuth: true },
    { path: "questionfile/update/:id", element: <UpdateQuestion />, requiresAuth: true },
    { path: "questionfile/update", element: <UpdateQuestion />, requiresAuth: true }, 
    { path: "upgrade", element: <UpgradePage/>, requiresAuth: true },
    { path: "study/:questionFileId", element: <StudySession />, requiresAuth: true },
    { path: "questionfile/findbyuser/:userId", element: <QuestionFileByUser />, requiresAuth: true },
    { path: "payment/vnpay/return", element: <PaymentSuccess />, requiresAuth: true },
    
    // Error pages
    { path: "unauthorized", element: <UnauthorizedPage />, requiresAuth: false },
    { path: "*", element: <NotFoundPage/>, requiresAuth: false },
];