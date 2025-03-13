
import ReportManagement from "../pages/AdminPages/Report/ReportManagement";
import Dashboard from "../pages/AdminPages/Dashboard/Dashboard";
import AccountManagement from "../pages/AdminPages/User/AccountManagement";
import ViewQuestions from "../pages/AdminPages/Report/ViewQuestions";
import AdminListQF from "../pages/AdminPages/QuestionFile/AdminListQF";
import Blog from "../pages/AdminPages/Blog/Blog";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import Settings from "../pages/AdminPages/Setting/Settings";
export const adminRoutes = [
    { path: "*", element: <NotFoundPage/> },
    { path: "", element: <Dashboard /> },
    { path: "Dashboard", element: <Dashboard /> },
    { path: "reports", element: <ReportManagement /> },
    { path: "Users", element: <AccountManagement /> },
    { path: "view-question-detail/:id", element: <ViewQuestions /> },
    { path: "questionFile/list", element: <AdminListQF /> },
    { path: "blogs", element: <Blog /> },
    {path: "settings", element: <Settings />},
    
  ];