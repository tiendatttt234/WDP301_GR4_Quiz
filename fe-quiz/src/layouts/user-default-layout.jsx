// UserDefaultPage.js
import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import UserHeader from "../components/Header/Header";


const { Header, Content, Footer } = Layout;

const UserDefaultPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header cố định */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          background: "#fff", // Màu nền tùy chỉnh
          padding: "0 20px",
        }}
      >
        <UserHeader />
      </Header>

      {/* Content ở giữa */}
      <Content
        style={{
          marginTop: "64px", // Khoảng cách để tránh bị Header che
          padding: "20px",
          background: "#f0f2f5", // Màu nền nhạt
          flex: 1, // Để Content chiếm không gian giữa Header và Footer
        }}
      >
        <Outlet /> {/* Nội dung thay đổi theo route */}
      </Content>

      {/* Footer cố định */}
      <Footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          background: "#fff", // Màu nền tùy chỉnh
          textAlign: "center",
          padding: "10px 0",
        }}
      >
        {/* <UserFooter /> */}
      </Footer>
    </Layout>
  );
};

export default UserDefaultPage;