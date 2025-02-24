import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/authen/Login/Login";
import Register from "./components/authen/Register/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
