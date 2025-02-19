import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FlashCards from "./pages/Quiz/FlashCard/FlashCards";
import QuizAttempt from "./pages/Quiz/QuizAttempt/QuizAttempt";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/attempt" element={<QuizAttempt />} />
      </Routes>
    </Router>
  );
}

export default App;