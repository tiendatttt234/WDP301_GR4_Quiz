// Header.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons";
import { Layout, Menu, Dropdown, Button, Avatar, Space, Badge } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../../helper/socket";
import axios from "axios";
import "./Header.css";
import { useAuth } from "../../Context/AuthContext";

const { Header: AntHeader } = Layout;

const Header = () => { // Xóa prop onSearchResults vì không còn cần nữa
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      if (user.id) {
        console.log("Registering user with ID:", user.id);
        socket.emit("registerUser", user.id);
        fetchNotifications(user.id);
      }
    };

    const fetchNotifications = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:9999/notifycation/${userId}`);
        const fetchedNotifications = response.data.notifications;
        setNotifications(fetchedNotifications);
        const unreadCount = fetchedNotifications.filter((notif) => !notif.isRead).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    socket.on("connect", () => {
      console.log("Socket.IO connected with ID:", socket.id);
      if (user.id) {
        socket.emit("registerUser", user.id);
      }
    });
    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

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

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newNotification");
    };
  }, [user.id]);

  const handleLogout = () => {
    logout();
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

  const handleGoToProfile = async () => {
    try {
      const response = await fetch(`http://localhost:9999/auth/profile/${user.id}`);
      if (response.ok) {
        const profile = await response.json();
        navigate(`/profile/${user.id}`, { state: { user: profile } });
      } else {
        console.error("Lỗi khi lấy dữ liệu hồ sơ");
      }
    } catch (error) {
      console.error("Lỗi kết nối đến server:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:9999/notifycation/${notificationId}/read`);
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
            className={notif.isRead ? "read" : "unread"}
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
      <Menu.Item key="3">
        <Link to="/questionfile/getAll">Thư viện của bạn</Link>
      </Menu.Item>
    </Menu>
  );

  const topicsMenu = (
    <Menu className="custom-menu" style={{ textDecoration: "none" }}>
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

      {/* Xóa phần tìm kiếm ở đây */}
      
      <Space size="middle" className="user-section">
        {user.userName ? (
          <>
            <span className="greeting">Xin chào, {user.userName}</span>
            <Dropdown overlay={notificationMenu}>
              <Badge count={notificationCount} className="notification-badge">
                <BellOutlined className="bell-icon" />
              </Badge>
            </Dropdown>
            <Dropdown overlay={userMenu}>
              <Avatar
                src={user.avatar ? `http://localhost:9999${user.avatar}` : "https://via.placeholder.com/40"}
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