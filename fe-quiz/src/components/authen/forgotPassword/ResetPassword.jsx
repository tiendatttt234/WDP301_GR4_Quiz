import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPass = () => {
    const navigate = useNavigate();
    const { id, token } = useParams();
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            toast.error("Mật khẩu không được để trống", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:9999/auth/reset-password/${id}/${token}`,
                { password }
            );

            if (response.data.status === "success") {
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    onClose: () => navigate("/login")
                });
            } else {
                toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật mật khẩu";
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div 
            style={{
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "#ffffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh", // Use minHeight to ensure it takes the full viewport height
                margin: 0,
                width: "100vw", // Ensure it takes the full viewport width
                position: "fixed", // Fix the position to cover the entire viewport
                top: 0,
                left: 0,
            }}
        >
            <Container 
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <div 
                    className="form-container"
                    style={{
                        textAlign: "left",
                        maxWidth: "400px",
                        width: "100%",
                        padding: "20px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#F9FAFB",
                    }}
                >
                    <div 
                        className="logo-container"
                        style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "#1F2937",
                            marginBottom: "16px",
                            textAlign: "center",
                        }}
                    >
                        Cập nhật lại mật khẩu
                    </div>
                    <form 
                        className="form" 
                        onSubmit={handleSubmit}
                        style={{ marginTop: "16px" }}
                    >
                        <div 
                            className="form-group"
                            style={{ marginBottom: "24px" }}
                        >
                            <label 
                                htmlFor="password"
                                style={{
                                    fontSize: "14px",
                                    color: "#4B5563",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu mới của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    fontSize: "16px",
                                    color: "#6B7280",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                        <button 
                            className="form-submit-btn" 
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#ffffff",
                                backgroundColor: "#3B82F6",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3B82F6"}
                        >
                            Cập nhật
                        </button>
                    </form>
                    <p 
                        className="signup-link"
                        style={{ 
                            textAlign: "center",
                            marginTop: "16px",
                        }}
                    >
                        Tôi không có tài khoản...
                        <a 
                            href="/register" 
                            className="signup-link link"
                            style={{
                                color: "#3B82F6",
                                textDecoration: "none",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                            Đăng kí ngay bây giờ
                        </a>
                    </p>
                </div>
            </Container>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ResetPass;