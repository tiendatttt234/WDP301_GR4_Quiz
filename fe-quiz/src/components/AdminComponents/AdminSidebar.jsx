import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  FolderOutlined 
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

        <Menu.Item key="/admin/reports" icon={<BarChartOutlined />}>
          <Link to="/admin/reports">{collapsed ? "" : "Reports"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/questionfile" icon={<FolderOutlined />}>
          <Link to="/admin/questionfile/list">{collapsed ? "" : "Question File"}</Link>
        </Menu.Item>
        <Menu.Item key="/admin/users" icon={<UserOutlined />}>
          <Link to="/admin/users">{collapsed ? "" : "Users"}</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminSidebar;
