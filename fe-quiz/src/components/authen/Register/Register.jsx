import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.repeatPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      await axios.post("http://localhost:9999/auth/register", {
        email: formData.email,
        userName: formData.userName,
        password: formData.password,
      });

      setSuccess("Đăng ký thành công!");
      setFormData({ userName: "", email: "", password: "", repeatPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Thông tin người dùng đã tồn tại");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f9f9f9" }}>
      <div style={{ display: "flex", backgroundColor: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", maxWidth: 800, width: "100%" }}>
        <div style={{ flex: 1, paddingRight: 20 }}>
          <h1 style={{ fontSize: "2em", marginBottom: 20 }}>Đăng ký</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            {[
              { name: "userName", type: "text", placeholder: "Tên đăng nhập" },
              { name: "email", type: "email", placeholder: "Email của bạn" },
              { name: "password", type: "password", placeholder: "Mật khẩu" },
              { name: "repeatPassword", type: "password", placeholder: "Nhập lại mật khẩu" },
            ].map(({ name, type, placeholder }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 5, fontSize: "1em" }}
                />
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", fontSize: "0.9em", marginBottom: 15 }}>
              <input type="checkbox" required style={{ marginRight: 10 }} /> Tôi đồng ý với
              <a href="#" style={{ color: "#007bff", textDecoration: "none", marginLeft: 5 }}> Điều khoản dịch vụ</a>
            </div>
            <button type="submit" style={{ display: "inline-block", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 5, fontSize: "1em", cursor: "pointer", textAlign: "center" }}>
              ĐĂNG KÝ
            </button>
          </form>
          <p style={{ marginTop: 15 }}>
            Đã có tài khoản? <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>Đăng nhập tại đây</Link>
          </p>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="https://storage.googleapis.com/a1aa/image/Afv_9_ppkeR2-6MQ381HvzwlbIdgFvurbY-M-d0g6Ms.jpg" alt="Minh họa" width="400" height="400" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      </div>
    </div>
  );
};

export default Register;
