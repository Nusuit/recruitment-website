// src/components/admin/Dashboard/UpcomingInterviews.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaVideo, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const UpcomingInterviews = () => {
  // Dữ liệu mẫu cho lịch phỏng vấn sắp tới
  const upcomingInterviews = [
    {
      id: 1,
      candidate: {
        id: 101,
        name: 'Nguyễn Văn A',
        position: 'Frontend Developer',
        avatar: null,
      },
      date: '2023-06-20',
      time: '09:30',
      type: 'online',
      platform: 'Google Meet',
      interviewers: ['Trần Quản Lý', 'Lê Tech Lead'],
    },
    {
      id: 2,
      candidate: {
        id: 102,
        name: 'Lê Văn C',
        position: 'Backend Developer',
        avatar: null,
      },
      date: '2023-06-21',
      time: '14:00',
      type: 'phone',
      platform: null,
      interviewers: ['Phạm HR', 'Hoàng CTO'],
    },
    {
      id: 3,
      candidate: {
        id: 103,
        name: 'Trần Thị B',
        position: 'UI/UX Designer',
        avatar: null,
      },
      date: '2023-06-22',
      time: '10:00',
      type: 'onsite',
      location: 'Phòng họp tầng 3',
      interviewers: ['Trần Giám đốc', 'Nguyễn Quản lý', 'Phạm Designer Lead'],
    },
  ];

  // Helper function để format ngày
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Helper function để render icon theo loại phỏng vấn
  const renderInterviewTypeIcon = (type) => {
    switch (type) {
      case 'online':
        return <FaVideo className="text-blue-500" />;
      case 'phone':
        return <FaPhoneAlt className="text-green-500" />;
      case 'onsite':
        return <FaMapMarkerAlt className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {upcomingInterviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Không có cuộc phỏng vấn nào sắp tới</p>
      ) : (
        upcomingInterviews.map((interview) => (
          <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                {interview.candidate.avatar ? (
                  <img
                    src={interview.candidate.avatar}
                    alt={interview.candidate.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                    {interview.candidate.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link to={`/admin/candidates/${interview.candidate.id}`} className="hover:text-blue-600">
                      {interview.candidate.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-500">{interview.candidate.position}</p>
                </div>
              </div>
              <div className="flex items-center text-xs">
                {renderInterviewTypeIcon(interview.type)}
                <span className="ml-1 text-gray-700">
                  {interview.type === 'online'
                    ? interview.platform
                    : interview.type === 'onsite'
                    ? interview.location
                    : 'Phỏng vấn qua điện thoại'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center text-xs text-gray-500">
                <FaCalendarAlt className="mr-1" />
                <span>{formatDate(interview.date)}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <FaClock className="mr-1" />
                <span>{interview.time}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>
                <span className="font-medium">Người phỏng vấn:</span>{' '}
                {interview.interviewers.join(', ')}
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <Link
                to={`/admin/interviews/${interview.id}`}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))
      )}
      <div className="text-center pt-2">
        <Link to="/admin/interviews" className="text-sm text-blue-600 hover:text-blue-800">
          Xem tất cả lịch phỏng vấn
        </Link>
      </div>
    </div>
  );
};

export default UpcomingInterviews;

