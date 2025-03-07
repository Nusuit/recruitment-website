// src/pages/admin/JobManagement.js
import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import JobList from '../../components/admin/JobManagement/JobList';
import JobForm from '../../components/admin/JobManagement/JobForm';

const JobManagement = () => {
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Xử lý khi muốn thêm mới một job
  const handleAddJob = () => {
    setSelectedJob(null);
    setShowAddJobForm(true);
  };

  // Xử lý khi muốn chỉnh sửa một job
  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowAddJobForm(true);
  };

  // Xử lý khi đóng form
  const handleCloseForm = () => {
    setShowAddJobForm(false);
    setSelectedJob(null);
  };

  // Xử lý khi lưu form (thêm mới hoặc cập nhật)
  const handleSaveJob = (jobData) => {
    // Trong thực tế, đây sẽ là API call để lưu dữ liệu
    console.log('Lưu dữ liệu job:', jobData);
    setShowAddJobForm(false);
    setSelectedJob(null);
    // Cập nhật lại danh sách job (mock data)
    // Trong thực tế, bạn có thể gọi API để lấy danh sách cập nhật
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý tuyển dụng</h1>
        <button
          onClick={handleAddJob}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" /> Thêm tin tuyển dụng
        </button>
      </div>

      {/* Thanh tìm kiếm và lọc */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tìm kiếm theo tiêu đề, vị trí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full md:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang tuyển</option>
              <option value="draft">Bản nháp</option>
              <option value="closed">Đã đóng</option>
              <option value="expired">Hết hạn</option>
            </select>
            <select
              className="block w-full md:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Sắp xếp theo</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="most_applicants">Nhiều ứng viên nhất</option>
              <option value="expiring_soon">Sắp hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách tin tuyển dụng */}
      <JobList onEditJob={handleEditJob} searchQuery={searchQuery} statusFilter={statusFilter} />

      {/* Form thêm/sửa tin tuyển dụng */}
      {showAddJobForm && (
        <JobForm
          job={selectedJob}
          onClose={handleCloseForm}
          onSave={handleSaveJob}
        />
      )}
    </div>
  );
};

export default JobManagement;