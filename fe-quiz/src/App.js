import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FlashCards from "./pages/Quiz/FlashCard/FlashCards";
import QuizAttempt from "./pages/Quiz/QuizAttempt/QuizAttempt";
import UserDefaultPage from "./layouts/user-default-layout";
import Login from "./components/authen/Login/Login";
import Register from "./components/authen/Register/Register";
import QuizResult from "./pages/Quiz/QuizResult/QuizResult";
import Profile from "./components/authen/Profile/Profile";
import ForgotPassword from "./components/authen/forgotPassword/ForgotPassword";
import Header from "./components/Header/Header";
import ResetPassword from "./components/authen/forgotPassword/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <h1>Home Page</h1>
            </>
          }
        />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/attempt" element={<QuizAttempt />} />
        <Route path="/result" element={<QuizResult />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route
          path="/user/*"
          element={<UserDefaultPage />}
          requiredRole="user"
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
