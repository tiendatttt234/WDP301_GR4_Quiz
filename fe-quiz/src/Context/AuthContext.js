import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userName: localStorage.getItem("userName") || "",
    id: localStorage.getItem("id") || "",
    roles: JSON.parse(localStorage.getItem("roles")) || [],
    accessToken: localStorage.getItem("accessToken") || "",
    avatar: localStorage.getItem("avatar") || "", // Thêm avatar vào trạng thái
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userName", userData.userName);
    localStorage.setItem("id", userData.id);
    localStorage.setItem("roles", JSON.stringify(userData.roles));
    localStorage.setItem("accessToken", userData.accessToken);
    localStorage.setItem("avatar", userData.avatar || ""); // Lưu avatar khi login
  };

  const logout = () => {
    setUser({ userName: "", id: "", roles: [], accessToken: "", avatar: "" });
    localStorage.clear();
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    if (updatedData.userName) {
      localStorage.setItem("userName", updatedData.userName);
    }
    if (updatedData.avatar) {
      localStorage.setItem("avatar", updatedData.avatar); // Cập nhật avatar vào localStorage
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
