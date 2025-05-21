// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authService';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Thêm email nếu cần
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      // URL backend của bạn, ví dụ http://localhost:8080/api/auth/register
      const response = await register({ username, email, password }); // Thêm email
      setSuccessMessage(response.data.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
      // Tự động chuyển đến trang đăng nhập sau khi đăng ký thành công
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Chờ 2 giây rồi chuyển hướng
    } catch (err) {
      if (err.response && err.response.data) {
        // Backend Spring Boot thường trả về message trong body khi badRequest
        const errorMessage = typeof err.response.data === 'string'
                             ? err.response.data
                             : err.response.data.message || 'Lỗi đăng ký. Vui lòng thử lại.';
        setError(errorMessage);
      } else {
        setError('Lỗi kết nối đến server. Vui lòng thử lại.');
      }
      console.error("Register error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng Ký</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}
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
          <div className="mb-4"> {/* Thêm trường email */}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email (tùy chọn)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // required // Bỏ required nếu email là tùy chọn ở backend
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
            Đăng Ký
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng nhập
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;