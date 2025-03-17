// pages/Payment/PaymentSuccess.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const success = query.get('success') === 'true';
  const message = query.get('message');
  const amount = query.get('amount');
  const transactionDate = query.get('transactionDate');
  const transactionId = query.get('transactionId');
  const orderId = query.get('orderId');

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!success) {
    return (
      <div className="payment-container">
        <h1>Thanh toán thất bại</h1>
        <p>{message || 'Đã xảy ra lỗi trong quá trình thanh toán.'}</p>
        <button onClick={handleBackToHome}>Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h1>Thanh toán thành công!</h1>
      <p>Tài khoản của bạn đã được nâng cấp lên Prime.</p>
      <div className="payment-details">
        <h3>Chi tiết giao dịch</h3>
        <p><strong>Số tiền:</strong> {amount}</p>
        <p><strong>Ngày giờ giao dịch:</strong> {transactionDate}</p>
        <p><strong>Mã giao dịch VNPay:</strong> {transactionId}</p>
        <p><strong>Mã đơn hàng:</strong> {orderId}</p>
      </div>
      <button onClick={handleBackToHome}>Quay lại trang chủ</button>
    </div>
  );
};

export default PaymentSuccess;