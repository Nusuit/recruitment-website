// src/components/admin/JobManagement/JobDetails.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaClock, FaMoneyBillWave, FaUsers } from 'react-icons/fa';

const JobDetails = ({ job }) => {
  if (!job) return null;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Helper function để hiển thị badge trạng thái
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đang tuyển</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Bản nháp</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Đã đóng</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Hết hạn</span>;
      default:
        return null;
    }
  };

  // Helper function để hiển thị loại công việc
  const getEmploymentTypeText = (type) => {
    switch (type) {
      case 'full-time':
        return 'Toàn thời gian';
      case 'part-time':
        return 'Bán thời gian';
      case 'contract':
        return 'Hợp đồng';
      case 'temporary':
        return 'Tạm thời';
      case 'intern':
        return 'Thực tập';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">{job.title}</h1>
          <div>{renderStatusBadge(job.status)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaBriefcase className="mr-2 text-gray-500" />
            <span>{job.department} • {getEmploymentTypeText(job.employmentType)}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <span>Hạn nộp: {formatDate(job.expires)}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaMoneyBillWave className="mr-2 text-gray-500" />
            <span>{job.salary || 'Thỏa thuận'}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaClock className="mr-2 text-gray-500" />
            <span>Kinh nghiệm: {job.experience}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaUsers className="mr-2 text-gray-500" />
            <span>{job.applicants} ứng viên đã nộp hồ sơ</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Mô tả công việc</h2>
          <div className="text-gray-700 whitespace-pre-line">{job.description}</div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Yêu cầu công việc</h2>
          <div className="text-gray-700 whitespace-pre-line">{job.requirements}</div>
        </div>

        {job.benefits && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Quyền lợi</h2>
            <div className="text-gray-700 whitespace-pre-line">{job.benefits}</div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Link to="/admin/jobs" className="btn btn-secondary">
            Quay lại danh sách
          </Link>
          <Link to={`/admin/jobs/${job.id}/applicants`} className="btn btn-primary">
            Xem danh sách ứng viên
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;