import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css"; // Import CSS tùy chỉnh

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Oops! Trang bạn tìm kiếm không tồn tại.</h2>
      <p className="not-found-text">
        Có vẻ như bạn đã nhập sai URL hoặc trang này đã bị xóa.
      </p>
      <button className="not-found-btn" onClick={() => navigate("/")}>
        Quay về trang chủ
      </button>
    </div>
  );
};

export default NotFoundPage;
