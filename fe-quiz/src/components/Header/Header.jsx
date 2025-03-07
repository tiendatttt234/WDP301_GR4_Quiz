import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined, BellOutlined } from "@ant-design/icons";
import { Layout, Menu, Dropdown, Button, Input, Avatar, Space, Badge } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Header.css"; // Import file CSS tùy chỉnh

const { Header: AntHeader } = Layout;

const Header = ({ onSearchResults }) => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [id, setId] = useState(localStorage.getItem("id") || "");
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      const accessToken = localStorage.getItem("accessToken");
      const storedUserName = localStorage.getItem("userName");
      const storedId = localStorage.getItem("id");
      const storedRoles = localStorage.getItem("roles");

      const handleStorageChange = () => {
        const updatedUserName = localStorage.getItem("userName");
        const updatedId = localStorage.getItem("id");
        setUserName(updatedUserName || "");
        setId(updatedId || "");
      };

      window.addEventListener("storage", handleStorageChange);

      if (accessToken && storedUserName && storedRoles) {
        try {
          const roleObj = JSON.parse(storedRoles);
          setUserName(storedUserName);
          setId(storedId);
          setUserRole(roleObj);
        } catch (error) {
          console.error("Error parsing roles:", error);
        }
      }

      return () => window.removeEventListener("storage", handleStorageChange);
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("id");
    localStorage.removeItem("roles");
    setUserName("");
    setId("");
    setUserRole(null);
    toast.success("Đăng xuất thành công!", {
      position: "top-right",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => navigate("/login"), 1200);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:9999/questionFile/search?name=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        onSearchResults(data.questionFiles);
      } else {
        console.error("Error searching for question files");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleGoToProfile = async () => {
    try {
      const response = await fetch(`http://localhost:9999/auth/profile/${id}`);
      if (response.ok) {
        const profile = await response.json();
        navigate(`/profile/${id}`, { state: { user: profile } });
      } else {
        console.error("Lỗi khi lấy dữ liệu hồ sơ");
      }
    } catch (error) {
      console.error("Lỗi kết nối đến server:", error);
    }
  };

  const toolsMenu = (
    <Menu className="custom-menu">
      <Menu.Item key="1">
        <Link to="/blogList">Blog</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/user/viewques">Thư viện của bạn</Link>
      </Menu.Item>
    </Menu>
  );

  const topicsMenu = (
    <Menu className="custom-menu">
      <Menu.Item key="1">
        <Link to="/user/quizHistory">Các bài quiz đã làm</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="#">Các học phần đã thích</Link>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu className="custom-menu">
      <Menu.Item key="1" onClick={handleGoToProfile}>
        Hồ sơ
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/upgrade">Nâng cấp</Link>
      </Menu.Item>
      <Menu.Item key="3" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="custom-header">
      {/* Logo */}
      <Link to="/" className="logo">
        <h1>Quiz</h1>
      </Link>

      {/* Công cụ và Chủ đề */}
      <Space size="middle" className="nav-links">
        <Dropdown overlay={toolsMenu}>
          <Button type="link" className="nav-button">
            Công cụ
          </Button>
        </Dropdown>
        <Dropdown overlay={topicsMenu}>
          <Button type="link" className="nav-button">
            Chủ đề
          </Button>
        </Dropdown>
      </Space>

      {/* Thanh tìm kiếm */}
      <Input
        className="custom-search"
        placeholder="Tìm kiếm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onPressEnter={handleSearch}
        suffix={
          <Button
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="search-button"
          />
        }
      />

      {/* User Section */}
      <Space size="middle" className="user-section">
        {userName ? (
          <>
            <span className="greeting">Xin chào, {userName}</span>
            <Badge count={5} className="notification-badge">
              <BellOutlined className="bell-icon" />
            </Badge>
            <Dropdown overlay={userMenu}>
              <Avatar
                src="http://pm1.aminoapps.com/7239/b508c8e2b879561f650574466b86531cc90138d9r1-768-768v2_uhq.jpg"
                size={40}
                className="user-avatar"
              />
            </Dropdown>
          </>
        ) : (
          <Link to="/login">
            <Button className="login-button">Đăng nhập</Button>
          </Link>
        )}
      </Space>

      <ToastContainer />
    </AntHeader>
  );
};

export default Header;