// UserDefaultPage.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";
import UserHeader from "../components/Header/Header";
import UserFooter from "../components/Footer/Footer";

const { Header, Content, Footer } = Layout;

const UserDefaultPage = () => {
  const location = useLocation();
  const isStudyPage = location.pathname.includes("/study/");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header cố định */}
      {!isStudyPage && (
        <Header
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1000,
            background: "#fff",
            padding: "0 20px",
          }}
        >
          <UserHeader />
        </Header>
      )}

      {/* Content ở giữa */}
      <Content
        style={{
          marginTop: isStudyPage ? 0 : "64px",
          padding: "20px",
          background: "#f0f2f5",
          flex: 1,
        }}
      >
        <Outlet />
      </Content>

      {/* Footer cố định */}
      {!isStudyPage && (
        <Footer
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            background: "#fff",
            textAlign: "center",
            padding: "10px 0",
          }}
        >
         
        </Footer>
      )}
       {/* <UserFooter /> */}
    </Layout>
  );
};

export default UserDefaultPage;