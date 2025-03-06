import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";

const ResetPass = () => {
    const navigate = useNavigate();
    const { id, token } = useParams(); // Lấy id và token từ URL params
    const [password, setPassword] = useState("");
    console.log(id, token);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            toast.error("Mật khẩu không được để trống");
            return;
        }

        // Kiểm tra id và token có tồn tại không
        if (!id || !token) {
            toast.error("ID hoặc token không hợp lệ");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:9999/auth/reset-password/${id}/${token}`, {
                password,
            });
            if (response.data.Status === "Success") {
                toast.success("Mật khẩu đã được cập nhật thành công");
                navigate("/login");
            } else {
                toast.error(response.data.Error || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật mật khẩu");
        }
    };

    return (
        <Container className="form-container">
            <style>
                {`
                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: #ffffff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .form-container {
                        text-align: left;
                        max-width: 400px;
                        width: 100%;
                        padding: 20px;
                        border: 1px solid #E5E7EB;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        background-color: #F9FAFB;
                    }
                    .logo-container {
                        font-size: 24px;
                        font-weight: 600;
                        color: #1F2937;
                        margin-bottom: 16px;
                        text-align: center;
                    }
                    .form {
                        margin-top: 16px;
                    }
                    .form-group {
                        margin-bottom: 24px;
                    }
                    .form-group label {
                        font-size: 14px;
                        color: #4B5563;
                        display: block;
                        margin-bottom: 8px;
                    }
                    .form-group input {
                        width: 100%;
                        padding: 12px;
                        font-size: 16px;
                        color: #6B7280;
                        background-color: #FFFFFF;
                        border: 1px solid #E5E7EB;
                        border-radius: 4px;
                    }
                    .form-submit-btn {
                        width: 100%;
                        padding: 12px;
                        font-size: 16px;
                        font-weight: 600;
                        color: #ffffff;
                        background-color: #3B82F6;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    .form-submit-btn:hover {
                        background-color: #2563EB;
                    }
                    .signup-link {
                        text-align: center;
                        margin-top: 16px;
                    }
                    .signup-link a {
                        color: #3B82F6;
                        text-decoration: none;
                    }
                    .signup-link a:hover {
                        text-decoration: underline;
                    }
                `}
            </style>
            <div className="logo-container">Cập nhật lại mật khẩu</div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới của bạn"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="form-submit-btn" type="submit">
                    Cập nhật
                </button>
            </form>
            <p className="signup-link">
                Tôi không có tài khoản...
                <a href="/register" className="signup-link link">
                    Đăng kí ngay bây giờ
                </a>
            </p>
        </Container>
    );
};

export default ResetPass;