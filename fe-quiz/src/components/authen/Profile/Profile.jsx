"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const id = localStorage.getItem("id");
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    userName: localStorage.getItem("userName") || "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID người dùng");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/auth/profile/${id}`);
        if (response.data && response.data.data) {
          setProfile(response.data.data);
          setFormData({
            email: response.data.data.email || "",
            phone: response.data.data.phone || "",
            userName: response.data.data.userName || "",
            avatar: response.data.data.avatar || "",
          });
        } else {
          throw new Error("Không thể lấy dữ liệu người dùng");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message || "Lỗi khi lấy thông tin người dùng");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const validateFormData = () => {
    if (formData.userName && formData.userName.length > 100) {
      return "Tên người dùng phải dưới 100 ký tự";
    }
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(formData.email)) {
      return "Vui lòng nhập email đúng định dạng";
    }
    const phoneRegex = /^[0]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      return "Số điện thoại phải gồm 10 số và bắt đầu bằng 0";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const validationError = validateFormData();
    if (validationError) {
      setMessage({ text: validationError, type: "error" });
      return;
    }

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("phone", formData.phone || "");
      data.append("userName", formData.userName);
      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      const response = await axios.patch(`http://localhost:9999/auth/profile/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.data) {
        setProfile(response.data.data);
        updateUser({
          userName: response.data.data.userName,
          avatar: response.data.data.avatar,
        });
        
        // Clear the avatar preview after successful upload
        setAvatarPreview(null);
        setAvatarFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        setMessage({ text: "Cập nhật thông tin thành công!", type: "success" });
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      let displayMessage;

      switch (errorMessage) {
        case "Invalid field name":
          displayMessage = "Tên trường không hợp lệ";
          break;
        case "Username must be less than 100 characters":
          displayMessage = "Tên người dùng phải dưới 100 ký tự";
          break;
        case "Please provide a valid email":
          displayMessage = "Vui lòng nhập email đúng định dạng";
          break;
        case "Phone number must be exactly 10 digits and start with 0":
          displayMessage = "Số điện thoại phải gồm 10 số và bắt đầu bằng 0";
          break;
        default:
          displayMessage = "Lỗi: " + errorMessage;
      }

      setMessage({ text: displayMessage, type: "error" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      setMessage({ text: "Vui lòng điền đầy đủ các trường mật khẩu", type: "error" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ text: "Mật khẩu mới và xác nhận mật khẩu không khớp", type: "error" });
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setMessage({
        text: "Mật khẩu mới phải ít nhất 8 ký tự và chứa cả chữ cái và số",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:9999/auth/${id}/change-password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.status) {
        setMessage({ text: "Đổi mật khẩu thành công!", type: "success" });
        setShowChangePassword(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        throw new Error(response.data.message || "Lỗi không xác định từ server");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      let displayMessage;

      switch (errorMessage) {
        case "Người dùng không tồn tại":
          displayMessage = "Người dùng không tồn tại";
          break;
        case "Mật khẩu hiện tại không đúng":
          displayMessage = "Mật khẩu cũ không đúng";
          break;
        case "Cập nhật mật khẩu thất bại":
          displayMessage = "Cập nhật mật khẩu thất bại, vui lòng thử lại";
          break;
        default:
          displayMessage = "Lỗi: " + errorMessage;
      }

      setMessage({ text: displayMessage, type: "error" });
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px" }}>Đang tải thông tin người dùng...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", fontSize: "16px" }}>Lỗi: {error}</p>;

  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        margin: 0,
        padding: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "linear-gradient(135deg, #1e88e5, #0d47a1)",
          borderRadius: "0 0 20px 20px",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "relative",
          width: "90%",
          maxWidth: "800px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          zIndex: 1,
          paddingBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#2196f3",
              fontSize: "14px",
              cursor: "pointer",
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => navigate("/")}
          >
            <i
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                marginRight: "5px",
                backgroundColor: "#2196f3",
                WebkitMaskImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M15 19l-7-7 7-7\'/%3E%3C/svg%3E")',
                WebkitMaskSize: "cover",
              }}
            ></i>
            Trở lại
          </div>
          
          {/* Updated Avatar Section with interactive features */}
          <div
            style={{
              position: "relative",
              width: "150px",
              height: "150px",
              margin: "0 auto",
              zIndex: 2,
              cursor: "pointer",
            }}
            onClick={handleAvatarClick}
          >
            <img
              src={
                avatarPreview 
                  ? avatarPreview 
                  : profile.avatar 
                    ? `http://localhost:9999${profile.avatar}` 
                    : "/assets/img/user1.png"
              }
              alt={profile.userName}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "5px solid white",
                objectFit: "cover",
                backgroundColor: "#f0f0f0",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            
            {/* Camera icon overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#2196f3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Avatar preview actions */}
        {avatarPreview && (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginTop: "10px",
            gap: "10px"
          }}>
            <span style={{ 
              color: "#666", 
              fontSize: "14px",
              display: "flex",
              alignItems: "center"
            }}>
              Ảnh đại diện mới đã được chọn
            </span>
            <button
              onClick={handleRemoveAvatar}
              style={{
                background: "none",
                border: "none",
                color: "#f44336",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{marginRight: "5px"}}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Hủy
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "0 20px", marginTop: "10px" }}>
          <h1 style={{ fontSize: "28px", color: "#333", margin: "10px 0 5px" }}>{profile.userName}</h1>
          <p style={{ color: "#777", margin: "0 0 20px" }}>{profile.email}</p>

          <div style={{ margin: "20px 0" }}>
            <p style={{ margin: "5px 0", color: "#555" }}>{profile.phone || "Chưa cập nhật số điện thoại"}</p>
          </div>

          {message && (
            <p
              style={{
                color: message.type === "success" ? "green" : "red",
                fontWeight: "bold",
                margin: "10px 0",
              }}
            >
              {message.text}
            </p>
          )}

          <form
            style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0" }}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder="Tên người dùng"
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(to right, #ff7b7b, #ffcc70)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "20px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.background = "linear-gradient(to right, #ffcc70, #ff7b7b)")}
              onMouseOut={(e) => (e.target.style.background = "linear-gradient(to right, #ff7b7b, #ffcc70)")}
            >
              Lưu thay đổi
            </button>
          </form>

          <button
            style={{
              background: "linear-gradient(to right, #1e88e5, #42a5f5)",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "30px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 10px rgba(33, 150, 243, 0.3)",
            }}
            onClick={() => setShowChangePassword(!showChangePassword)}
            onMouseOver={(e) => {
              e.target.style.background = "linear-gradient(to right, #1976d2, #1e88e5)";
              e.target.style.boxShadow = "0 6px 15px rgba(33, 150, 243, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "linear-gradient(to right, #1e88e5, #42a5f5)";
              e.target.style.boxShadow = "0 4px 10px rgba(33, 150, 243, 0.3)";
            }}
          >
            Đổi mật khẩu
          </button>

          {showChangePassword && (
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0" }}
              onSubmit={handleChangePassword}
            >
              <input
                type="password"
                name="oldPassword"
                placeholder="Mật khẩu cũ"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Xác nhận mật khẩu mới"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              />
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "darkgreen")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "green")}
                >
                  Xác nhận
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setShowChangePassword(false)}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "darkred")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "red")}
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;