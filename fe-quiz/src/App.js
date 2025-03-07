import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserDefaultPage from "./layouts/user-default-layout";

import AdminDefaultPage from "./layouts/admin-default-layout";



import { userRoutes } from "./routes/UserRoutes";
import { adminRoutes } from "./routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>


        <Route path="/*" element={<UserDefaultPage />}>
          {userRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="/admin/*" element={<AdminDefaultPage />}>
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
