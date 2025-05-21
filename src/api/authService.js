// src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/'; // URL backend Spring Boot của bạn

export const login = (credentials) => {
  return axios.post(API_URL + 'login', credentials);
};

export const register = (userData) => {
  return axios.post(API_URL + 'register', userData);
};

// (Tùy chọn) Hàm logout có thể gọi API backend nếu bạn có endpoint logout phía server
// hoặc chỉ đơn giản là xóa token phía client.
// export const logout = () => {
//   return axios.post(API_URL + 'logout'); // Nếu backend có endpoint logout
// };