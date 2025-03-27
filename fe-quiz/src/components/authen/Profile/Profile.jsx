import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [profile, setProfile] = useState({
    userName: localStorage.getItem("userName") || "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:9999/auth/profile/${id}`, formData);
      if (response.data && response.data.data) {
        setProfile(response.data.data);
        localStorage.setItem("userName", response.data.data.userName);
        alert("Cập nhật thành công!");
        window.dispatchEvent(new Event("storage"));
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ");
      }
    } catch (error) {
      alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("Mật khẩu mới không khớp");
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:9999/auth/${id}/change-password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        alert("Đổi mật khẩu thành công!");
        setShowChangePassword(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        throw new Error(response.data.message || "Lỗi đổi mật khẩu");
      }
    } catch (error) {
      alert("Lỗi đổi mật khẩu: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "20px" }}>Đang tải thông tin người dùng...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>Lỗi: {error}</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f7fa" }}>
      <div style={{ display: "flex", width: "600px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(to bottom right, #ffcc70, #ff7b7b)", padding: "30px", textAlign: "center", color: "white", flex: 1 }}>
          <img alt="Profile" src={profile.avatar || "https://via.placeholder.com/150"} style={{ borderRadius: "50%", width: "100px", height: "100px" }} />
          <h2>{profile.userName}</h2>
          <p>{profile.email}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "10px", padding: "8px", backgroundColor: "white", color: "black", border: "none", borderRadius: "5px", cursor: "pointer" }}>Trở lại</button>
        </div>
        <div style={{ padding: "30px", flex: 2 }}>
          <h3>Cập nhật thông tin</h3>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <input type="text" name="userName" value={formData.userName} onChange={handleChange} required placeholder="Tên người dùng" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <button type="submit" style={{ padding: "10px", backgroundColor: "#ff7b7b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Lưu thay đổi</button>
          </form>
          <button onClick={() => setShowChangePassword(!showChangePassword)} style={{ marginTop: "10px", padding: "8px", backgroundColor: "#ffcc70", border: "none", borderRadius: "5px", cursor: "pointer" }}>Đổi mật khẩu</button>
          {showChangePassword && (
            <form onSubmit={handleChangePassword} style={{ marginTop: "10px" }}>
              <input type="password" name="oldPassword" placeholder="Mật khẩu cũ" value={passwordData.oldPassword} onChange={handlePasswordChange} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              <input type="password" name="newPassword" placeholder="Mật khẩu mới" value={passwordData.newPassword} onChange={handlePasswordChange} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              <input type="password" name="confirmNewPassword" placeholder="Xác nhận mật khẩu mới" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              <button type="submit" style={{ marginTop: "10px", padding: "8px", backgroundColor: "green", border: "none", borderRadius: "5px", cursor: "pointer" }}>Xác nhận</button>
              <button type="button" onClick={() => setShowChangePassword(false)} style={{ marginTop: "10px", padding: "8px", backgroundColor: "red", border: "none", borderRadius: "5px", cursor: "pointer" }}>Hủy</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
