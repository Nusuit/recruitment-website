// src/pages/client/Application.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import ApplicationForm from '../../components/client/Application/ApplicationForm';

const Application = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch job data
  useEffect(() => {
    // Giả lập API call để lấy dữ liệu chi tiết công việc
    setTimeout(() => {
      // Mock data
      const mockJob = {
        id: parseInt(id),
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions',
        logo: null,
        location: 'Hà Nội',
        employmentType: 'full-time',
        salary: '1500$ - 2500$',
        experience: '3-5 năm',
        published: '2023-06-01',
        expires: '2023-07-01',
      };
      setJob(mockJob);
      setLoading(false);
    }, 500);
  }, [id]);

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

  const handleSubmit = (formData) => {
    // Giả lập gửi dữ liệu đến API
    setLoading(true);
    console.log('Submitting application data:', formData);
    
    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (loading && !isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> Không thể tìm thấy thông tin công việc. Vui lòng thử lại sau.</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Ứng tuyển thành công!</h2>
              <p className="mt-2 text-gray-600">
                Đơn ứng tuyển của bạn đã được gửi đến nhà tuyển dụng. Chúng tôi sẽ thông báo khi có phản hồi từ họ.
              </p>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <p className="text-gray-700">{job.company}</p>
              </div>
              
              <div className="mt-8 flex flex-col space-y-3">
                <Link
                  to="/"
                  className="btn bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Quay lại trang chủ
                </Link>
                <Link
                  to="/profile"
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Xem trạng thái ứng tuyển
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Ứng tuyển vị trí: {job.title}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center">
              <div className="mr-4">
                {job.logo ? (
                  <img src={job.logo} alt={job.company} className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                    <FaBuilding className="text-gray-400 text-2xl" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                <p className="text-gray-700">{job.company}</p>
                
                <div className="mt-2 grid grid-cols-2 gap-2">
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
              </div>
            </div>
          </div>
          
          <ApplicationForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Application;