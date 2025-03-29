import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserDefaultPage from "./layouts/user-default-layout";
import AdminDefaultPage from "./layouts/admin-default-layout";

import { userRoutes } from "./routes/UserRoutes";
import { adminRoutes } from "./routes/AdminRoutes";
import { AuthProvider } from "./Context/AuthContext";

// Import our guards
import { AdminGuard, UserGuard, PublicGuard } from "./helper/roleGuard";

// Import Unauthorized page
import UnauthorizedPage from "./pages/NotFound/UnauthorizedPage";

function App() {
  // Helper to determine if a route is a public route (login, register, forgot password, etc.)
  const isPublicRoute = (path) => {
    const publicPaths = [
      "login", 
      "register", 
      "forgot-password", 
      "reset-password",
      ""
    ];
    return publicPaths.some(publicPath => path.includes(publicPath));
  };

  // Filter routes into protected (requiring authentication) and public routes
  const protectedUserRoutes = userRoutes.filter(route => !isPublicRoute(route.path));
  const publicUserRoutes = userRoutes.filter(route => isPublicRoute(route.path));

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes (login, register, etc.) */}
          <Route element={<PublicGuard />}>
            <Route path="/*" element={<UserDefaultPage />}>
              {publicUserRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* Protected user routes */}
          <Route element={<UserGuard />}>
            <Route path="/*" element={<UserDefaultPage />}>
              {protectedUserRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* Admin routes - protected by AdminGuard */}
          <Route element={<AdminGuard />}>
            <Route path="/admin/*" element={<AdminDefaultPage />}>
              {adminRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;