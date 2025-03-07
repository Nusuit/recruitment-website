// src/components/client/Profile/ApplicationStatus.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaEye, FaTrash, FaExclamationCircle, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUserTie } from 'react-icons/fa';

const ApplicationStatus = ({ applications, onDelete }) => {
  // Helper function để format ngày
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Helper function để render icon và text trạng thái
  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center">
            <FaHourglassHalf className="text-yellow-500 mr-1" />
            <span className="text-yellow-700">Đang chờ xử lý</span>
          </div>
        );
      case 'reviewing':
        return (
          <div className="flex items-center">
            <FaUserTie className="text-blue-500 mr-1" />
            <span className="text-blue-700">Đang xem xét</span>
          </div>
        );
      case 'interview':
        return (
          <div className="flex items-center">
            <FaCalendarAlt className="text-purple-500 mr-1" />
            <span className="text-purple-700">Mời phỏng vấn</span>
          </div>
        );
      case 'offered':
        return (
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-1" />
            <span className="text-green-700">Đã nhận việc</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center">
            <FaTimesCircle className="text-red-500 mr-1" />
            <span className="text-red-700">Đã từ chối</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h2>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-10">
          <FaExclamationCircle className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Không có đơn ứng tuyển</h3>
          <p className="mt-1 text-gray-500">Bạn chưa nộp đơn ứng tuyển nào.</p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Tìm việc làm ngay
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                  <div>
                    <Link
                      to={`/jobs/${application.jobId}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800 mb-1 block"
                    >
                      {application.jobTitle}
                    </Link>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaBuilding className="mr-1 text-gray-400" />
                      <span>{application.company}</span>
                      <span className="mx-2">•</span>
                      <FaMapMarkerAlt className="mr-1 text-gray-400" />
                      <span>{application.location}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {renderStatus(application.status)}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-1 text-gray-400" />
                    <span>Ngày ứng tuyển: {formatDate(application.appliedDate)}</span>
                  </div>
                  {application.interviewDate && (
                    <div className="flex items-center text-sm text-purple-600 font-medium">
                      <FaCalendarAlt className="mr-1" />
                      <span>Ngày phỏng vấn: {formatDate(application.interviewDate)}</span>
                    </div>
                  )}
                </div>

                {application.notes && (
                  <div className="mt-3 text-sm text-gray-700">
                    <p className="font-medium mb-1">Ghi chú:</p>
                    <p>{application.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-2">
                  <Link
                    to={`/jobs/${application.jobId}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <FaEye className="mr-1" /> Xem tin tuyển dụng
                  </Link>
                  <button
                    onClick={() => onDelete(application.id)}
                    className="text-red-600 hover:text-red-800 flex items-center text-sm"
                  >
                    <FaTrash className="mr-1" /> Xóa đơn
                  </button>
                </div>
              </div>

              {application.status === 'interview' && (
                <div className="bg-purple-100 p-3 border-t border-purple-200">
                  <p className="text-sm text-purple-800">
                    <FaExclamationCircle className="inline mr-1" /> Bạn có lịch phỏng vấn vào ngày{' '}
                    <strong>{formatDate(application.interviewDate)}</strong>. Vui lòng kiểm tra email để biết chi tiết.
                  </p>
                </div>
              )}

              {application.status === 'offered' && (
                <div className="bg-green-100 p-3 border-t border-green-200">
                  <p className="text-sm text-green-800">
                    <FaCheckCircle className="inline mr-1" /> Chúc mừng! Bạn đã nhận được lời mời làm việc. Vui lòng kiểm tra email để xem chi tiết.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;