// src/pages/admin/CandidateManagement.js
import React from 'react';
import { FaUserTie, FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';

const CandidateManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý ứng viên</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tìm kiếm theo tên, kỹ năng..."
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select className="block w-full md:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="">Trạng thái</option>
              <option value="new">Mới</option>
              <option value="reviewing">Đang xem xét</option>
              <option value="interview">Đã phỏng vấn</option>
              <option value="offered">Đã đề xuất</option>
              <option value="hired">Đã tuyển</option>
              <option value="rejected">Đã từ chối</option>
            </select>
            
            <select className="block w-full md:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="">Vị trí</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Developer</option>
              <option value="ui-ux">UI/UX Designer</option>
              <option value="product">Product Manager</option>
            </select>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">
              <FaFilter className="mr-2" /> Lọc nâng cao
            </button>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <FaUserTie className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Trang Quản lý ứng viên đang được phát triển</h3>
          <p className="mt-1 text-gray-500">Chức năng này sẽ sớm được hoàn thiện.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateManagement;
