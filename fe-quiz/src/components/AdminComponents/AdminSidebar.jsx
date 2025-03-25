import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  AreaChartOutlined ,
  UserOutlined,
  FolderOutlined,
  FlagOutlined,
  ToolOutlined
} from "@ant-design/icons";
import "./Sidebar.css";

const AdminSidebar = ({ collapsed }) => {
  const location = useLocation();

  return (
    <div className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-title">{collapsed ? "" : ""}</div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["/admin/dashboard"]}
        className="sidebar-menu"
        inlineCollapsed={collapsed}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key="/admin/dashboard" icon={<AreaChartOutlined  />}>
          <Link to="/admin/dashboard">{collapsed ? "" : "Thống Kê"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/reports" icon={<FlagOutlined  />}>
          <Link to="/admin/reports">{collapsed ? "" : "Báo Cáo"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/questionfile" icon={<FolderOutlined />}>
          <Link to="/admin/questionfile/list">{collapsed ? "" : "Tệp Câu Hỏi"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/accounts" icon={<UserOutlined />}>
          <Link to="/admin/accounts">{collapsed ? "" : "Tài Khoản"}</Link>
        </Menu.Item>
        {/* <Menu.Item key="/admin/blogs" icon={<FileTextOutlined />}>
          <Link to="/admin/blogs">{collapsed ? "" : "Blogs"}</Link>
        </Menu.Item> */}
        <Menu.Item key="/admin/settings" icon={< ToolOutlined />}>
          <Link to="/admin/settings">{collapsed ? "" : "Cài Đặt"}</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminSidebar;