// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Sẽ cần cài đặt react-router-dom
import { login } from '../api/authService'; // Giả sử bạn tạo file này
import { saveToken } from '../services/tokenService'; // Giả sử bạn tạo file này

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // URL backend của bạn, ví dụ http://localhost:8080/api/auth/login
      // Backend Spring Boot của bạn phải đang chạy và cho phép CORS từ frontend
      const response = await login({ username, password });
      saveToken(response.data.token); // Lưu token vào localStorage
      // Chuyển hướng đến trang chủ hoặc trang dashboard sau khi đăng nhập thành công
      // navigate('/dashboard'); // Bạn sẽ cần định nghĩa route này
      alert('Đăng nhập thành công! Token: ' + response.data.token); // Tạm thời alert
      // TODO: Chuyển hướng người dùng
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Lỗi đăng nhập. Vui lòng thử lại.');
      } else {
        setError('Lỗi kết nối đến server. Vui lòng thử lại.');
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng Nhập</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Đăng Nhập
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')} // Chuyển hướng đến trang đăng ký
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng ký ngay
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;