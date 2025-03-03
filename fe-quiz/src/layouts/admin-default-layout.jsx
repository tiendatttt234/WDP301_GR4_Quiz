import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet từ react-router-dom
import AdminHeader from "../components/AdminComponents/AdminHeader";
import AdminSidebar from "../components/AdminComponents/AdminSidebar";
import "./DefaultAdminLayout.css";
import { Layout } from "antd";
const { Header, Content, Sider } = Layout; // Phân rã Layout thành các thành phần con

const AdminDefaultPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header>
        <AdminHeader onToggleSidebar={toggleCollapsed} />
      </Header>

      {/* Sidebar + Content */}
      <Layout>
        <Sider
          collapsed={collapsed}
          width={250} // Chiều rộng mặc định của Sidebar
          collapsedWidth={80} // Chiều rộng khi thu gọn
          trigger={null} // Không hiển thị trigger mặc định của Ant Design
          style={{
            background: "#2c3e50", // Màu nền giống hình ảnh
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <AdminSidebar collapsed={collapsed} />
        </Sider>

        <Content
          style={{
            padding: "20px", // Padding giống hình ảnh
            background: "#f0f2f5", // Màu nền nhạt giống hình ảnh
            minHeight: 280, // Để đảm bảo Content có chiều cao tối thiểu
          }}
        >
          <Outlet /> {/* Hiển thị nội dung của route con tại đây */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDefaultPage;