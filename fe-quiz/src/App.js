import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FlashCards from "./pages/Quiz/FlashCard/FlashCards";
import QuizAttempt from "./pages/Quiz/QuizAttempt/QuizAttempt";
import UserDefaultPage from "./layouts/user-default-layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/attempt" element={<QuizAttempt />} />
        <Route
          path="/user/*"
          element={<UserDefaultPage />}
          requiredRole="user"
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;