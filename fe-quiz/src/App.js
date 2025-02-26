import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FlashCards from "./pages/Quiz/FlashCard/FlashCards";
import QuizAttempt from "./pages/Quiz/QuizAttempt/QuizAttempt";
import UserDefaultPage from "./layouts/user-default-layout";
import Login from "./components/authen/Login/Login";
import Register from "./components/authen/Register/Register";
import QuizResult from "./pages/Quiz/QuizResult/QuizResult";
import Profile from "./components/authen/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/attempt" element={<QuizAttempt />} />
        <Route path="/result" element={<QuizResult />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/user/*"
          element={<UserDefaultPage />}
          requiredRole="user"
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
