// src/components/admin/Dashboard/RecentApplicants.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

const RecentApplicants = () => {
  // Dữ liệu mẫu cho ứng viên gần đây
  const recentApplicants = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      position: 'Frontend Developer',
      applied: '2023-06-15',
      status: 'Mới',
      avatar: null,
    },
    {
      id: 2,
      name: 'Trần Thị B',
      position: 'UI/UX Designer',
      applied: '2023-06-14',
      status: 'Đang xét duyệt',
      avatar: null,
    },
    {
      id: 3,
      name: 'Lê Văn C',
      position: 'Backend Developer',
      applied: '2023-06-13',
      status: 'Mời phỏng vấn',
      avatar: null,
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      position: 'Product Manager',
      applied: '2023-06-12',
      status: 'Mới',
      avatar: null,
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      position: 'DevOps Engineer',
      applied: '2023-06-11',
      status: 'Đã từ chối',
      avatar: null,
    },
  ];

  // Helper function để render status badge
  const renderStatusBadge = (status) => {
    let bgColor;
    switch (status) {
      case 'Mới':
        bgColor = 'bg-blue-100 text-blue-800';
        break;
      case 'Đang xét duyệt':
        bgColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'Mời phỏng vấn':
        bgColor = 'bg-green-100 text-green-800';
        break;
      case 'Đã từ chối':
        bgColor = 'bg-red-100 text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }
    return <span className={`${bgColor} px-2 py-1 rounded-full text-xs`}>{status}</span>;
  };

  // Helper function để format ngày
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ứng viên
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vị trí
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày ứng tuyển
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recentApplicants.map((applicant) => (
            <tr key={applicant.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {applicant.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={applicant.avatar}
                        alt={applicant.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {applicant.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{applicant.position}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(applicant.applied)}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {renderStatusBadge(applicant.status)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/admin/candidates/${applicant.id}`} className="text-blue-600 hover:text-blue-900">
                  <FaEye className="inline mr-1" /> Xem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentApplicants;

