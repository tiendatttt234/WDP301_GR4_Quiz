import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9999/learning", 
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
  const response = await axiosInstance.get(`/${questionFileId}`, { 
    params: { reset },
  });
  return response.data;
};

export const submitAnswer = async (questionFileId, questionId, selectedAnswers) => {
  const response = await axiosInstance.post(`/submit`, { 
    questionFileId,
    questionId,
    selectedAnswers,
  });
  return response.data;
};

export const endRound = async (questionFileId) => {
  const response = await axiosInstance.post(`/end-round/${questionFileId}`);
  return response.data;
};

export const resetStudySession = async (questionFileId) => { // Thêm hàm reset
  const response = await axiosInstance.post(`/reset/${questionFileId}`);
  return response.data;
};