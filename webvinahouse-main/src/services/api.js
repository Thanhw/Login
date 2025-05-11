// src/services/api.js (Ví dụ)
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // // backend: địa chỉ backend Django của bạn
  headers: {
    'Content-Type': 'application/json',
    // // backend: Có thể cần thêm header Authorization nếu dùng token
  }
});

// // backend: interceptor để xử lý token hoặc lỗi chung
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;