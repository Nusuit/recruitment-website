// src/pages/admin/InterviewSchedule.js
import React from 'react';
import { FaCalendarAlt, FaPlus, FaFilter } from 'react-icons/fa';

const InterviewSchedule = () => {
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Lịch phỏng vấn</h1>
        <button className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" /> Tạo lịch phỏng vấn
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-gray-600">
            <span className="font-medium">{currentDate}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select className="block w-full md:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="">Tuần này</option>
              <option value="next-week">Tuần sau</option>
              <option value="this-month">Tháng này</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">
              <FaFilter className="mr-2" /> Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Trang Lịch phỏng vấn đang được phát triển</h3>
          <p className="mt-1 text-gray-500">Chức năng này sẽ sớm được hoàn thiện.</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;
