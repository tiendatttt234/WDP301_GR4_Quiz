import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined, BellOutlined } from "@ant-design/icons";
import {
  Layout,
  Menu,
  Dropdown,
  Button,
  Input,
  Avatar,
  Space,
  Badge,
} from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../../helper/socket";
import axios from "axios";
import "./Header.css";

const { Header: AntHeader } = Layout;

const Header = ({ onSearchResults }) => {
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [id, setId] = useState(localStorage.getItem("id") || "");
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  console.log("userRole", id + userRole);

  useEffect(() => {
    const loadUserData = () => {
      const accessToken = localStorage.getItem("accessToken");
      const storedUserName = localStorage.getItem("userName");
      const storedId = localStorage.getItem("id");

      setUserName(storedUserName || "");
      setId(storedId || "");

      if (accessToken && storedUserName) {
        if (storedId) {
          console.log("Registering user with ID:", storedId);
          socket.emit("registerUser", storedId);
          fetchNotifications(storedId);
        }
      }
    };

    const fetchNotifications = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:9999/notifycation/${userId}`
        );
        const fetchedNotifications = response.data.notifications;
        setNotifications(fetchedNotifications);
        const unreadCount = fetchedNotifications.filter(
          (notif) => !notif.isRead
        ).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Kiểm tra kết nối Socket.IO
    socket.on("connect", () => {
      console.log("Socket.IO connected with ID:", socket.id);
      if (id) {
        socket.emit("registerUser", id); // Đăng ký lại khi reconnect
      }
    });
    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    // Lắng nghe thông báo real-time
    socket.on("newNotification", (notification) => {
      console.log("Received notification:", notification);
      setNotifications((prev) => [...prev, notification]);
      setNotificationCount((prev) => prev + 1);
      toast.info(notification.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });

    loadUserData();

    // Lắng nghe thay đổi localStorage
    const handleStorageChange = () => {
      const updatedUserName = localStorage.getItem("userName");
      const updatedId = localStorage.getItem("id");
      setUserName(updatedUserName || "");
      setId(updatedId || "");
      if (updatedId) {
        socket.emit("registerUser", updatedId);
        fetchNotifications(updatedId);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Dọn dẹp
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newNotification");
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [id]); // Thêm id vào dependency để reload khi id thay đổi

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("id");
    localStorage.removeItem("roles");
    setUserName("");
    setId("");
    setUserRole(null);
    setNotifications([]);
    setNotificationCount(0);
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
      const response = await fetch(
        `http://localhost:9999/questionFile/search?name=${searchQuery}`
      );
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

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `http://localhost:9999/notifycation/${notificationId}/read`
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setNotificationCount((prev) => prev - 1);
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    }
  };

  const notificationMenu = (
    <Menu className="notification-menu">
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <Menu.Item
            key={index}
            onClick={() => !notif.isRead && markAsRead(notif._id)}
            className={notif.isRead ? "read" : "unread"} // Thêm class dựa trên trạng thái
          >
            {notif.message}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item key="0" className="no-notifications">
          Không có thông báo
        </Menu.Item>
      )}
    </Menu>
  );

  const toolsMenu = (
    <Menu className="custom-menu">
      <Menu.Item key="1">
        <Link to="/blogList">Blog</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/questionfile/create">Tạo tệp câu hỏi</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/questionfile/getAll">Thư viện của bạn</Link>
      </Menu.Item>
    </Menu>
  );

  const topicsMenu = (
    <Menu className="custom-menu" style={{textDecoration: "none"}}>
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
      <Link to="/" className="logo">
        <h1>Quiz</h1>
      </Link>

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

      <Space size="middle" className="user-section">
        {userName ? (
          <>
            <span className="greeting">Xin chào, {userName}</span>
            <Dropdown overlay={notificationMenu}>
              <Badge count={notificationCount} className="notification-badge">
                <BellOutlined className="bell-icon" />
              </Badge>
            </Dropdown>
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
