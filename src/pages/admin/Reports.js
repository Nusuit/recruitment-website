// src/pages/admin/Reports.js
import React, { useState } from 'react';
import { FaChartBar, FaChartPie, FaChartLine, FaDownload, FaFilter, FaTable, FaExclamationCircle } from 'react-icons/fa';
import RecruitmentChart from '../../components/admin/Reports/RecruitmentChart';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('this-month');
  const [reportType, setReportType] = useState('recruitment');

  // Dữ liệu mẫu cho biểu đồ tuyển dụng
  const recruitmentData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Ứng viên mới',
        data: [45, 52, 38, 60, 56, 68],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Phỏng vấn',
        data: [32, 35, 25, 40, 38, 41],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
      },
      {
        label: 'Đã tuyển',
        data: [10, 12, 8, 14, 13, 18],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
      },
    ],
  };

  // Dữ liệu mẫu cho các thống kê tổng quan
  const statsTiles = [
    {
      title: 'Tổng số ứng viên',
      value: 235,
      change: '+14%',
      changeType: 'increase',
      icon: <FaChartBar className="h-5 w-5 text-blue-600" />,
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Tỷ lệ tuyển dụng',
      value: '28.4%',
      change: '+2.5%',
      changeType: 'increase',
      icon: <FaChartPie className="h-5 w-5 text-green-600" />,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Thời gian tuyển',
      value: '22 ngày',
      change: '+3 ngày',
      changeType: 'decrease',
      icon: <FaChartLine className="h-5 w-5 text-purple-600" />,
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Tỷ lệ từ chối offer',
      value: '15%',
      change: '-3%',
      changeType: 'increase',
      icon: <FaTable className="h-5 w-5 text-orange-600" />,
      bgColor: 'bg-orange-100',
    },
  ];

  // Xử lý thay đổi khoảng thời gian
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  // Xử lý thay đổi loại báo cáo
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  // Xử lý xuất báo cáo
  const handleExportReport = () => {
    alert('Chức năng xuất báo cáo đang được phát triển!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Báo cáo tuyển dụng</h1>
        <button 
          onClick={handleExportReport}
          className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center"
        >
          <FaDownload className="mr-2" /> Xuất báo cáo
        </button>
      </div>

      {/* Bộ lọc báo cáo */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <span className="font-medium mr-4">Loại báo cáo:</span>
            <select 
              value={reportType}
              onChange={handleReportTypeChange}
              className="block w-full md:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="recruitment">Tuyển dụng</option>
              <option value="performance">Hiệu suất</option>
              <option value="demographics">Nhân khẩu học</option>
              <option value="turnover">Biến động nhân sự</option>
            </select>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium mr-2">Thời gian:</span>
            <select 
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="block w-full md:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="this-month">Tháng này</option>
              <option value="last-month">Tháng trước</option>
              <option value="this-quarter">Quý này</option>
              <option value="last-quarter">Quý trước</option>
              <option value="this-year">Năm nay</option>
              <option value="last-year">Năm trước</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
            
            {timeRange === 'custom' && (
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <input
                  type="date"
                  className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span>đến</span>
                <input
                  type="date"
                  className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <FaFilter className="mr-2" /> Áp dụng
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsTiles.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">{stat.title}</h3>
              <div className={`${stat.bgColor} p-2 rounded-full`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'} mt-1 flex items-center`}>
              {stat.changeType === 'increase' ? (
                <FaChartLine className="mr-1" />
              ) : (
                <FaChartLine className="mr-1 transform rotate-180" />
              )} 
              {stat.change} so với kỳ trước
            </div>
          </div>
        ))}
      </div>

      {/* Report Charts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ hiệu suất tuyển dụng</h2>
        <div className="h-80">
          <RecruitmentChart data={recruitmentData} />
        </div>
      </div>
      
      {/* Report Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Thống kê theo phòng ban</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Xem chi tiết
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí đang tuyển
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phỏng vấn
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã tuyển
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ tuyển dụng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Kỹ thuật</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">5</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">78</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">25</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">7</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">9.0%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Marketing</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">3</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">42</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">18</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">4</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">9.5%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Nhân sự</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">2</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">35</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">12</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">3</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">8.6%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Tài chính</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">4</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">28</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">15</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">5</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">17.9%</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;