import axios from "axios";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: "http://localhost:9999/learning", // Điều chỉnh baseURL theo cấu hình của bạn
});

// Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getStudySession = async (questionFileId, reset = false) => {
  const response = await axiosInstance.get(`/study/${questionFileId}`, {
    params: { reset },
  });
  return response.data;
};

export const submitAnswer = async (questionFileId, questionId, selectedAnswers) => {
  const response = await axiosInstance.post(`/study/answer`, {
    questionFileId,
    questionId,
    selectedAnswers,
  });
  return response.data;
};

export const endRound = async (questionFileId) => {
  const response = await axiosInstance.post(`/study/end-round/${questionFileId}`);
  return response.data;
};