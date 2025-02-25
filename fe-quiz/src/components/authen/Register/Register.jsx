import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

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
      const response = await axios.post("http://localhost:9999/auth/register", {
        email: formData.email,
        userName: formData.userName,
        password: formData.password,
      });

      setSuccess("Đăng ký thành công!");
      setFormData({ userName: "", email: "", password: "", repeatPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "thông tin người dùng đã tồn tại");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Đăng ký</h1>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        {success && <p className="success-message" style={{ color: "green" }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="userName"
              placeholder="Tên đăng nhập"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <i className="fas fa-key"></i>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.repeatPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" required /> Tôi đồng ý với
              <a href="#"> Điều khoản dịch vụ</a>
            </label>
          </div>
          <button className="btn" type="submit">ĐĂNG KÝ</button>
        </form>
        <p>Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link></p>
      </div>
      <div className="image-container">
        <img
          src="https://storage.googleapis.com/a1aa/image/Afv_9_ppkeR2-6MQ381HvzwlbIdgFvurbY-M-d0g6Ms.jpg"
          alt="Minh họa một người với các hình học"
          width="400"
          height="400"
        />
      </div>
    </div>
  );
};

export default Register;
