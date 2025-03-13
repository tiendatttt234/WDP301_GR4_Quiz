// ReportModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  ModalContent, CloseButton, ModalTitle, ModalOption,
  ModalButton, ModalRadioInput
} from './styleModal.js';

// Đặt app element cho react-modal (nếu cần)
Modal.setAppElement("#root");

const ReportModal = ({ isOpen, onRequestClose, questionFileId }) => {
  const [selectedReason, setSelectedReason] = useState("");

  const handleReasonChange = (reason) => {
    setSelectedReason(reason);
  };

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      toast.error('Vui lòng chọn một lý do báo cáo!', { autoClose: 2000 });
      return;
    }

    const userId = localStorage.getItem("id");
    if (!userId) {
      toast.error('Không tìm thấy thông tin người dùng!', { autoClose: 2000 });
      return;
    }

    const reportData = {
      reportBy: userId,
      questionFile: questionFileId,
      reason: selectedReason,
      status: "pending",
    };

    try {
      await axios.post('http://localhost:9999/api/reports/create', reportData);
      toast.success('Báo cáo đã được gửi thành công!', { autoClose: 2000 });
      onRequestClose();
      setSelectedReason(""); // Reset lý do sau khi gửi
    } catch (error) {
      console.error('Lỗi khi gửi báo cáo:', error);
      toast.error('Gửi báo cáo thất bại!', { autoClose: 2000 });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          width: "500px",
          maxHeight: "80vh",
          overflow: "auto",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        },
      }}
    >
      <ModalContent>
        <CloseButton onClick={onRequestClose}>×</CloseButton>
        <ModalTitle>Báo cáo học phần này</ModalTitle>
        <p style={{ marginBottom: '20px' }}>
          Vì sao bạn lại báo cáo học phần này?
        </p>
        <ModalOption>
          <ModalRadioInput
            type="radio"
            name="report-reason"
            value="Nội dung có thông tin không chính xác"
            checked={selectedReason === "Nội dung có thông tin không chính xác"}
            onChange={() => handleReasonChange("Nội dung có thông tin không chính xác")}
          />
          Nội dung có thông tin không chính xác
        </ModalOption>
        <ModalOption>
          <ModalRadioInput
            type="radio"
            name="report-reason"
            value="Nội dung không phù hợp"
            checked={selectedReason === "Nội dung không phù hợp"}
            onChange={() => handleReasonChange("Nội dung không phù hợp")}
          />
          Nội dung không phù hợp
        </ModalOption>
        <ModalOption>
          <ModalRadioInput
            type="radio"
            name="report-reason"
            value="Nội dung được sử dụng để gian lận"
            checked={selectedReason === "Nội dung được sử dụng để gian lận"}
            onChange={() => handleReasonChange("Nội dung được sử dụng để gian lận")}
          />
          Nội dung được sử dụng để gian lận
        </ModalOption>
        <ModalOption>
          <ModalRadioInput
            type="radio"
            name="report-reason"
            value="Nội dung vi phạm quyền sở hữu trí tuệ của tổ chức hoặc cá nhân"
            checked={selectedReason === "Nội dung vi phạm quyền sở hữu trí tuệ của tổ chức hoặc cá nhân"}
            onChange={() => handleReasonChange("Nội dung vi phạm quyền sở hữu trí tuệ của tổ chức hoặc cá nhân")}
          />
          Nội dung vi phạm quyền sở hữu trí tuệ của tổ chức hoặc cá nhân
        </ModalOption>
        <ModalButton onClick={handleSubmitReport}>Tiếp tục</ModalButton>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;