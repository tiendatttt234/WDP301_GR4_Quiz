import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const styles = {
    body: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      margin: 0,
    },
    container: {
      textAlign: "left",
      maxWidth: "400px",
      width: "100%",
      padding: "20px",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#F9FAFB",
    },
    heading: {
      fontSize: "24px",
      fontWeight: 600,
      color: "#1F2937",
      marginBottom: "16px",
    },
    paragraph: {
      fontSize: "16px",
      color: "#4B5563",
      marginBottom: "24px",
    },
    label: {
      fontSize: "14px",
      color: "#4B5563",
      display: "block",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      color: "#6B7280",
      backgroundColor: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: "4px",
      marginBottom: "24px",
    },
    button: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      fontWeight: 600,
      color: "#ffffff",
      backgroundColor: "#3B82F6",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#2563EB",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9999/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setEmail(""); // Clear input after success
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Đặt lại mật khẩu của bạn</h1>
        <p style={styles.paragraph}>
          Nhập email bạn đã đăng ký. Chúng tôi sẽ gửi cho bạn một liên kết để
          đăng nhập và đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@email.com"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.button.backgroundColor)
            }
          >
            Gửi
          </button>
        </form>
      </div>
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

export default ForgotPassword;
