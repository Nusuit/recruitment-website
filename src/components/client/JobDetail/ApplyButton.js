// src/components/client/JobDetail/ApplyButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const ApplyButton = ({ jobId, daysLeft }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Ứng tuyển ngay</h2>
      
      {daysLeft <= 0 ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <p className="font-medium">Tin tuyển dụng đã hết hạn</p>
          <p className="text-sm">Bạn không thể ứng tuyển vào vị trí này.</p>
        </div>
      ) : (
        <>
          {isAuthenticated ? (
            <Link
              to={`/apply/${jobId}`}
              className="block w-full py-3 px-4 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Ứng tuyển ngay
            </Link>
          ) : (
            <div>
              <Link
                to={`/login?redirect=/apply/${jobId}`}
                className="block w-full py-3 px-4 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md mb-3"
              >
                Đăng nhập để ứng tuyển
              </Link>
              <div className="text-center text-sm text-gray-500">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800">
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            Ứng tuyển nhanh chóng và dễ dàng
          </div>
        </>
      )}
    </div>
  );
};

export default ApplyButton;

