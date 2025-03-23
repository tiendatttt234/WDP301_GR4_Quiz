// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userName: localStorage.getItem("userName") || "",
    id: localStorage.getItem("id") || "",
    roles: JSON.parse(localStorage.getItem("roles")) || [],
    accessToken: localStorage.getItem("accessToken") || "",
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userName", userData.userName);
    localStorage.setItem("id", userData.id);
    localStorage.setItem("roles", JSON.stringify(userData.roles));
    localStorage.setItem("accessToken", userData.accessToken);
  };

  const logout = () => {
    setUser({ userName: "", id: "", roles: [], accessToken: "" });
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
