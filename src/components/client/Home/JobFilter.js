// src/components/client/Home/JobFilter.js
import React, { useState } from 'react';
import { FaFilter, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';

const JobFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experience: '',
    salary: false,
  });
  
  // Dữ liệu mẫu cho các bộ lọc
  const locations = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
  const jobTypes = [
    { value: 'full-time', label: 'Toàn thời gian' },
    { value: 'part-time', label: 'Bán thời gian' },
    { value: 'contract', label: 'Hợp đồng' },
    { value: 'temporary', label: 'Tạm thời' },
    { value: 'intern', label: 'Thực tập' },
  ];
  const experienceLevels = ['Không yêu cầu kinh nghiệm', '1 năm', '2 năm', '3-5 năm', '5+ năm'];

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Lọc tìm kiếm</h2>
        <FaFilter className="text-gray-600" />
      </div>

      {/* Bộ lọc Địa điểm */}
      <div className="mb-6">
        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FaMapMarkerAlt className="mr-2" /> Địa điểm
        </h3>
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        >
          <option value="">Tất cả địa điểm</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Bộ lọc Loại công việc */}
      <div className="mb-6">
        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FaBriefcase className="mr-2" /> Loại công việc
        </h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="job-type-all"
              type="radio"
              name="job-type"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              checked={filters.jobType === ''}
              onChange={() => handleFilterChange('jobType', '')}
            />
            <label htmlFor="job-type-all" className="ml-2 block text-sm text-gray-700">
              Tất cả
            </label>
          </div>
          {jobTypes.map((type) => (
            <div key={type.value} className="flex items-center">
              <input
                id={`job-type-${type.value}`}
                type="radio"
                name="job-type"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                checked={filters.jobType === type.value}
                onChange={() => handleFilterChange('jobType', type.value)}
              />
              <label htmlFor={`job-type-${type.value}`} className="ml-2 block text-sm text-gray-700">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Bộ lọc Kinh nghiệm */}
      <div className="mb-6">
        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FaGraduationCap className="mr-2" /> Kinh nghiệm
        </h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="experience-all"
              type="radio"
              name="experience"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              checked={filters.experience === ''}
              onChange={() => handleFilterChange('experience', '')}
            />
            <label htmlFor="experience-all" className="ml-2 block text-sm text-gray-700">
              Tất cả
            </label>
          </div>
          {experienceLevels.map((exp) => (
            <div key={exp} className="flex items-center">
              <input
                id={`experience-${exp}`}
                type="radio"
                name="experience"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                checked={filters.experience === exp}
                onChange={() => handleFilterChange('experience', exp)}
              />
              <label htmlFor={`experience-${exp}`} className="ml-2 block text-sm text-gray-700">
                {exp}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Bộ lọc Lương */}
      <div className="mb-6">
        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FaMoneyBillWave className="mr-2" /> Lương
        </h3>
        <div className="flex items-center">
          <input
            id="salary-disclosed"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={filters.salary}
            onChange={(e) => handleFilterChange('salary', e.target.checked)}
          />
          <label htmlFor="salary-disclosed" className="ml-2 block text-sm text-gray-700">
            Hiển thị mức lương
          </label>
        </div>
      </div>

      <button
        onClick={() => {
          setFilters({
            location: '',
            jobType: '',
            experience: '',
            salary: false,
          });
          onFilterChange({
            location: '',
            jobType: '',
            experience: '',
            salary: false,
          });
        }}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default JobFilter;

