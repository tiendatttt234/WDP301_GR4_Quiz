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
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [id, setId] = useState(localStorage.getItem("id") || "");
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      const accessToken = localStorage.getItem("accessToken");
      const storedUserName = localStorage.getItem("userName");
      const storedId = localStorage.getItem("id");

      setUserName(storedUserName || "");
      setId(storedId || "");

      if (accessToken && storedUserName && storedId) {
        socket.emit("registerUser", storedId);
        fetchNotifications(storedId);
      }
    };

    const fetchNotifications = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:9999/notifycation/${userId}`);
        const fetchedNotifications = response.data.notifications || [];
        setNotifications(fetchedNotifications);
        const unreadCount = fetchedNotifications.filter((notif) => !notif.isRead).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Không thể tải thông báo!", { position: "top-right", autoClose: 2000 });
      }
    };

    socket.on("connect", () => {
      console.log("Socket.IO connected with ID:", socket.id);
      if (id) socket.emit("registerUser", id);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socket.on("newNotification", (notification) => {
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

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newNotification");
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [id]);

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
    });
    setTimeout(() => navigate("/login"), 1200);
  };

  const handleSearch = async (query) => {
    const MIN_KEYWORD_LENGTH = 2;
    if (!query.trim()) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm!", { position: "top-right", autoClose: 2000 });
      return;
    }
    if (query.trim().length < MIN_KEYWORD_LENGTH) {
      toast.error(`Từ khóa tìm kiếm phải có ít nhất ${MIN_KEYWORD_LENGTH} ký tự!`, {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      const response = await axios.get(`http://localhost:9999/search/all`, {
        params: { keyword: query },
      });
      if (response.data.success) {
        onSearchResults(response.data);
        navigate(`/search?keyword=${encodeURIComponent(query)}`);
      } else {
        toast.warn(response.data.message || "Không tìm thấy kết quả!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi tìm kiếm!";
      toast.error(errorMessage, { position: "top-right", autoClose: 2000 });
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGoToProfile = async () => {
    try {
      const response = await fetch(`http://localhost:9999/auth/profile/${id}`);
      if (response.ok) {
        const profile = await response.json();
        navigate(`/profile/${id}`, { state: { user: profile } });
      } else {
        toast.error("Lỗi khi lấy dữ liệu hồ sơ!", { position: "top-right", autoClose: 2000 });
      }
    } catch (error) {
      console.error("Lỗi kết nối đến server:", error);
      toast.error("Lỗi kết nối đến server!", { position: "top-right", autoClose: 2000 });
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
      setNotificationCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
      toast.error("Không thể đánh dấu thông báo đã đọc!", { position: "top-right", autoClose: 2000 });
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
        placeholder="Tìm kiếm học phần, người dùng..."
        value={searchQuery}
        onChange={handleInputChange}
        onPressEnter={() => handleSearch(searchQuery)}
        suffix={
          <Button
            icon={<SearchOutlined />}
            onClick={() => handleSearch(searchQuery)}
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