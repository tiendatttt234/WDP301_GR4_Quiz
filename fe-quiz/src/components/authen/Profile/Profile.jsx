import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const id = localStorage.getItem("id");
  const [profile, setProfile] = useState({
    userName: localStorage.getItem("userName") || "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
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

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("phone", formData.phone);
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
        // Cập nhật cả userName và avatar trong AuthContext
        updateUser({ 
          userName: response.data.data.userName, 
          avatar: response.data.data.avatar 
        });
        setMessage({ text: "Cập nhật thành công!", type: "success" });
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ");
      }
    } catch (error) {
      setMessage({
        text: "Lỗi cập nhật: " + (error.response?.data?.message || error.message),
        type: "error",
      });
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

  if (loading) return <p style={{ textAlign: "center", marginTop: "20px" }}>Đang tải thông tin người dùng...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>Lỗi: {error}</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f7fa" }}>
      <div style={{ display: "flex", width: "600px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(to bottom right, #ffcc70, #ff7b7b)", padding: "30px", textAlign: "center", color: "white", flex: 1 }}>
          <img
            alt="Profile"
            src={profile.avatar ? `http://localhost:9999${profile.avatar}` : "https://via.placeholder.com/150"}
            style={{ borderRadius: "50%", width: "100px", height: "100px" }}
          />
          <h2>{profile.userName}</h2>
          <p>{profile.email}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "10px", padding: "8px", backgroundColor: "white", color: "black", border: "none", borderRadius: "5px", cursor: "pointer" }}>Trở lại</button>
        </div>
        <div style={{ padding: "30px", flex: 2 }}>
          <h3>Cập nhật thông tin</h3>
          {message && (
            <p style={{ 
              color: message.type === "success" ? "green" : "red", 
              marginBottom: "10px", 
              fontWeight: "bold" 
            }}>
              {message.text}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <input type="text" name="userName" value={formData.userName} onChange={handleChange} required placeholder="Tên người dùng" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <input type="file" name="avatar" accept="image/*" onChange={handleAvatarChange} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <button type="submit" style={{ padding: "10px", backgroundColor: "#ff7b7b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Lưu thay đổi</button>
          </form>
          <button onClick={() => setShowChangePassword(!showChangePassword)} style={{ marginTop: "10px", padding: "8px", backgroundColor: "#ffcc70", border: "none", borderRadius: "5px", cursor: "pointer" }}>Đổi mật khẩu</button>
          {showChangePassword && (
            <form onSubmit={handleChangePassword} style={{ marginTop: "10px" }}>
              <input 
                type="password" 
                name="oldPassword" 
                placeholder="Mật khẩu cũ" 
                value={passwordData.oldPassword} 
                onChange={handlePasswordChange} 
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }} 
              />
              <input 
                type="password" 
                name="newPassword" 
                placeholder="Mật khẩu mới" 
                value={passwordData.newPassword} 
                onChange={handlePasswordChange} 
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }} 
              />
              <input 
                type="password" 
                name="confirmNewPassword" 
                placeholder="Xác nhận mật khẩu mới" 
                value={passwordData.confirmNewPassword} 
                onChange={handlePasswordChange} 
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }} 
              />
              <button 
                type="submit" 
                style={{ marginTop: "10px", padding: "8px", backgroundColor: "green", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Xác nhận
              </button>
              <button 
                type="button" 
                onClick={() => setShowChangePassword(false)} 
                style={{ marginTop: "10px", padding: "8px", backgroundColor: "red", border: "none", borderRadius: "5px", cursor: "pointer", marginLeft: "10px" }}
              >
                Hủy
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;