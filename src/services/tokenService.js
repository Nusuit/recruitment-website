// src/services/tokenService.js

const TOKEN_KEY = 'authToken';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  // (Tùy chọn) Bạn có thể thêm logic kiểm tra token hết hạn ở đây
  return !!token;
};