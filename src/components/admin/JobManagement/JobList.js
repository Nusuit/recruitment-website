// src/components/admin/JobManagement/JobList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaCopy, FaEye, FaTrash, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const JobList = ({ onEditJob, searchQuery, statusFilter }) => {
  // Dữ liệu mẫu cho danh sách tin tuyển dụng
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Mock data - trong thực tế, bạn sẽ lấy từ API
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        title: 'Frontend Developer',
        location: 'Hà Nội',
        department: 'Engineering',
        salary: '1000$ - 2000$',
        created: '2023-06-01',
        expires: '2023-07-01',
        status: 'active',
        applicants: 12,
        description: 'Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm...',
      },
      {
        id: 2,
        title: 'Backend Developer',
        location: 'Hồ Chí Minh',
        department: 'Engineering',
        salary: '1500$ - 2500$',
        created: '2023-06-02',
        expires: '2023-07-02',
        status: 'active',
        applicants: 8,
        description: 'Chúng tôi đang tìm kiếm Backend Developer có kinh nghiệm...',
      },
      {
        id: 3,
        title: 'UI/UX Designer',
        location: 'Đà Nẵng',
        department: 'Design',
        salary: '1200$ - 2200$',
        created: '2023-06-03',
        expires: '2023-07-03',
        status: 'active',
        applicants: 5,
        description: 'Chúng tôi đang tìm kiếm UI/UX Designer có kinh nghiệm...',
      },
      {
        id: 4,
        title: 'Product Manager',
        location: 'Hà Nội',
        department: 'Product',
        salary: '2000$ - 3000$',
        created: '2023-05-15',
        expires: '2023-06-15',
        status: 'expired',
        applicants: 15,
        description: 'Chúng tôi đang tìm kiếm Product Manager có kinh nghiệm...',
      },
      {
        id: 5,
        title: 'DevOps Engineer',
        location: 'Hồ Chí Minh',
        department: 'Operations',
        salary: '1800$ - 2800$',
        created: '2023-05-20',
        expires: '2023-06-20',
        status: 'closed',
        applicants: 7,
        description: 'Chúng tôi đang tìm kiếm DevOps Engineer có kinh nghiệm...',
      },
    ];
    setJobs(mockJobs);
  }, []);

  // Lọc tin tuyển dụng dựa trên tìm kiếm và trạng thái
  useEffect(() => {
    let results = [...jobs];

    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      results = results.filter(job => job.status === statusFilter);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        job =>
          job.title.toLowerCase().includes(lowerCaseQuery) ||
          job.location.toLowerCase().includes(lowerCaseQuery) ||
          job.department.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredJobs(results);
  }, [jobs, searchQuery, statusFilter]);

  // Xử lý xóa tin tuyển dụng
  const handleDeleteJob = (jobId) => {
    // Trong thực tế, đây sẽ là API call để xóa
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  // Xử lý thay đổi trạng thái tin tuyển dụng
  const handleChangeStatus = (jobId, newStatus) => {
    // Trong thực tế, đây sẽ là API call để cập nhật trạng thái
    setJobs(
      jobs.map(job => {
        if (job.id === jobId) {
          return { ...job, status: newStatus };
        }
        return job;
      })
    );
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

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {filteredJobs.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>Không tìm thấy tin tuyển dụng nào phù hợp với tiêu chí tìm kiếm.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tin tuyển dụng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạn nộp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-1" /> {job.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.created)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.expires)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaUsers className="text-gray-400 mr-1" /> {job.applicants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEditJob(job)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                      <Link
                        to={`/admin/jobs/${job.id}/applicants`}
                        className="text-green-600 hover:text-green-900"
                        title="Xem ứng viên"
                      >
                        <FaUsers />
                      </Link>
                      <Link
                        to={`/jobs/${job.id}`}
                        target="_blank"
                        className="text-purple-600 hover:text-purple-900"
                        title="Xem trang công khai"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => onEditJob({ ...job, id: null, title: `Copy of ${job.title}` })}
                        className="text-gray-600 hover:text-gray-900"
                        title="Nhân bản"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobList;



