// src/pages/admin/Dashboard.js
import React from 'react';
import { FaUsers, FaBriefcase, FaUserCheck, FaCalendarCheck } from 'react-icons/fa';
import StatCard from '../../components/admin/Dashboard/StatCard';
import RecentApplicants from '../../components/admin/Dashboard/RecentApplicants';
import UpcomingInterviews from '../../components/admin/Dashboard/UpcomingInterviews';
import RecruitmentChart from '../../components/admin/Reports/RecruitmentChart';

const Dashboard = () => {
  // Dữ liệu mẫu cho dashboard
  const stats = [
    {
      title: 'Tổng số ứng viên',
      value: 235,
      icon: <FaUsers className="h-6 w-6 text-white" />,
      change: '+14%',
      changeType: 'increase',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Tin tuyển dụng đang mở',
      value: 12,
      icon: <FaBriefcase className="h-6 w-6 text-white" />,
      change: '+2',
      changeType: 'increase',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Ứng viên phù hợp',
      value: 45,
      icon: <FaUserCheck className="h-6 w-6 text-white" />,
      change: '+5',
      changeType: 'increase',
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Phỏng vấn tuần này',
      value: 8,
      icon: <FaCalendarCheck className="h-6 w-6 text-white" />,
      change: '-2',
      changeType: 'decrease',
      bgColor: 'bg-orange-500',
    },
  ];

  // Dữ liệu mẫu cho biểu đồ
  const chartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Biểu đồ hiệu suất tuyển dụng */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hiệu suất tuyển dụng</h2>
        <div className="h-80">
          <RecruitmentChart data={chartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ứng viên gần đây */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ứng viên gần đây</h2>
          <RecentApplicants />
        </div>

        {/* Lịch phỏng vấn sắp tới */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch phỏng vấn sắp tới</h2>
          <UpcomingInterviews />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

