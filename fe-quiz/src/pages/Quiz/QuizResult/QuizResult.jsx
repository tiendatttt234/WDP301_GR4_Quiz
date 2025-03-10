import React from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Button } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function QuizResult() {
  const navigate = useNavigate();

  // Dữ liệu cứng
  const results = {
    newQuizResult: {
      correctAnswersCount: 7,
      incorrectAnswersCount: 3,
      createdAt: "2025-02-25 14:30:00",
    },
  };

  const correctCount = results.newQuizResult.correctAnswersCount;
  const incorrectCount = results.newQuizResult.incorrectAnswersCount;
  const totalCount = correctCount + incorrectCount;

  // Pie chart data
  const data = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [correctCount, incorrectCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className="quiz-result-page text-center">
      <h2>Your Quiz Results</h2>
      <p>
        Correct Answers: {correctCount} / {totalCount}
      </p>
      <p>Time taken: {results.newQuizResult.createdAt}</p>
      <div style={{ width: "300px", margin: "auto" }}>
        <Pie data={data} />
      </div>
      <div className="mt-4">
        <Button variant="primary" onClick={() => navigate(`/user/viewques`)}>
          Go back to your folder
        </Button>
      </div>
    </div>
  );
}
