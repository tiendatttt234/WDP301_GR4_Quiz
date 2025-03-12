import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  FlagOutlined ,
  FolderOutlined,
  FileTextOutlined,
  ToolOutlined
} from "@ant-design/icons";
import "./Sidebar.css";

const AdminSidebar = ({ collapsed }) => {
  const location = useLocation();

  return (
    <div className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-title">{collapsed ? "" : "Management"}</div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["/admin/dashboard"]}
        className="sidebar-menu"
        inlineCollapsed={collapsed}
        selectedKeys={[location.pathname]}
      >
        <Menu.Item key="/admin/dashboard" icon={<HomeOutlined />}>
          <Link to="/admin/dashboard">{collapsed ? "" : "Dashboard"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/reports" icon={<FlagOutlined  />}>
          <Link to="/admin/reports">{collapsed ? "" : "Reports"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/questionfile" icon={<FolderOutlined />}>
          <Link to="/admin/questionfile/list">{collapsed ? "" : "Question File"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/users" icon={<UserOutlined />}>
          <Link to="/admin/users">{collapsed ? "" : "Users"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/blogs" icon={<FileTextOutlined />}>
          <Link to="/admin/blogs">{collapsed ? "" : "Blogs"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/settings" icon={< ToolOutlined />}>
          <Link to="/admin/settings">{collapsed ? "" : "Settings"}</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminSidebar;
