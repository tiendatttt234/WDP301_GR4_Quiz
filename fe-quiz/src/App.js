

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDefaultPage from "./layouts/user-default-layout";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <Routes>
        <Route
          path="/user/*"
          element={<UserDefaultPage />}
          requiredRole="user"
        />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
