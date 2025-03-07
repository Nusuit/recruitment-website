// src/pages/auth/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({
        ...errors,
        email: '',
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!email) {
      tempErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        // Mô phỏng API call
        setTimeout(() => {
          // Giả lập thành công
          setIsLoading(false);
          setIsSubmitted(true);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
        setErrors({
          ...errors,
          general: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
          </p>
        </div>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}
        
        {isSubmitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <p className="font-medium">Đã gửi email!</p>
            <p className="text-sm">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.</p>
            <div className="mt-4">
              <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <FaArrowLeft className="mr-2" /> Quay lại trang đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Địa chỉ email"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                <FaArrowLeft className="mr-1" /> Quay lại đăng nhập
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Đang xử lý...' : 'Gửi hướng dẫn đặt lại mật khẩu'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;