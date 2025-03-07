// src/pages/admin/Settings.js
import React from 'react';
import { FaCog, FaUser, FaBell, FaLock, FaBuilding } from 'react-icons/fa';

const Settings = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Cài đặt hệ thống</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <a href="#" className="py-4 px-6 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
              <FaUser className="inline mr-2" /> Tài khoản
            </a>
            <a href="#" className="py-4 px-6 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <FaBuilding className="inline mr-2" /> Công ty
            </a>
            <a href="#" className="py-4 px-6 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <FaBell className="inline mr-2" /> Thông báo
            </a>
            <a href="#" className="py-4 px-6 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <FaLock className="inline mr-2" /> Bảo mật
            </a>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center items-center py-10">
            <div className="text-center">
              <FaCog className="mx-auto h-12 w-12 text-gray-400 animate-spin" style={{ animationDuration: '3s' }} />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Trang Cài đặt đang được phát triển</h3>
              <p className="mt-1 text-gray-500">Chức năng này sẽ sớm được hoàn thiện.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;