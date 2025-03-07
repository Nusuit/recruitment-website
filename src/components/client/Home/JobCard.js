// src/components/client/Home/JobCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaClock, FaRegBookmark, FaMoneyBillWave } from 'react-icons/fa';

const JobCard = ({ job }) => {
  // Helper function để format ngày
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
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

  // Calculate days left
  const calculateDaysLeft = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(job.expires);

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="p-4 flex flex-col md:flex-row">
        {/* Company Logo */}
        <div className="w-full md:w-16 mb-4 md:mb-0 md:mr-4 flex justify-center md:justify-start">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
              <FaBuilding className="text-gray-400 text-xl" />
            </div>
          )}
        </div>

        {/* Job Info */}
        <div className="flex-grow">
          <Link to={`/jobs/${job.id}`} className="block mb-1">
            <h2 className="text-lg font-semibold text-blue-600 hover:text-blue-800">{job.title}</h2>
          </Link>
          
          <Link to={`/companies/${job.company.replace(/\s+/g, '-').toLowerCase()}`} className="text-gray-700 font-medium hover:text-blue-600 mb-2 block">
            {job.company}
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-1 text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaMoneyBillWave className="mr-1 text-gray-400" />
              <span>{job.salary || 'Thỏa thuận'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-1 text-gray-400" />
              <span>{getEmploymentTypeText(job.employmentType)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-1 text-gray-400" />
              <span>Kinh nghiệm: {job.experience}</span>
            </div>
          </div>
          
          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center text-sm text-gray-500 mb-2 md:mb-0">
              <span>Ngày đăng: {formatDate(job.published)}</span>
              <span className="mx-2">•</span>
              {daysLeft > 0 ? (
                <span className="text-green-600">Còn {daysLeft} ngày để ứng tuyển</span>
              ) : (
                <span className="text-red-600">Đã hết hạn</span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <FaRegBookmark className="inline mr-1" /> Lưu
              </button>
              <Link to={`/apply/${job.id}`} className="text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 text-sm font-medium">
                Ứng tuyển ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;