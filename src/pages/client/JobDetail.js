// src/pages/client/JobDetail.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMoneyBillWave, FaShare, FaRegBookmark, FaPrint, FaArrowLeft } from 'react-icons/fa';
import JobDescription from '../../components/client/JobDetail/JobDescription';
import ApplyButton from '../../components/client/JobDetail/ApplyButton';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);

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
        description: `Chúng tôi đang tìm kiếm một Senior Frontend Developer tài năng để tham gia vào đội ngũ phát triển sản phẩm của công ty.

Mô tả công việc:
- Phát triển và duy trì các ứng dụng web sử dụng React, Redux và TypeScript
- Phối hợp với back-end developers để thiết kế và triển khai API
- Tối ưu hóa hiệu suất ứng dụng web
- Viết unit test và đảm bảo chất lượng code
- Tham gia vào quá trình thiết kế UX/UI
- Mentor cho các thành viên junior trong team`,
        requirements: `Yêu cầu công việc:
- Tối thiểu 3 năm kinh nghiệm làm việc với React
- Thành thạo JavaScript/TypeScript, HTML, CSS
- Hiểu biết về state management (Redux, MobX, Context API)
- Kinh nghiệm làm việc với RESTful APIs
- Hiểu biết về testing frameworks như Jest, React Testing Library
- Có kinh nghiệm với Git và các công cụ CI/CD
- Tiếng Anh giao tiếp tốt
- Kỹ năng giao tiếp và làm việc nhóm hiệu quả`,
        benefits: `Quyền lợi:
- Mức lương cạnh tranh theo năng lực
- Thưởng dự án và thưởng cuối năm
- Chế độ bảo hiểm sức khỏe cho nhân viên và người thân
- 15 ngày phép/năm
- Môi trường làm việc năng động, cởi mở
- Cơ hội học hỏi và phát triển sự nghiệp
- Các hoạt động team building thường xuyên`,
        skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Redux', 'Jest', 'Git'],
        companyInfo: {
          name: 'Tech Solutions',
          website: 'https://techsolutions.example.com',
          size: '50-200 nhân viên',
          industry: 'Công nghệ thông tin',
          description: 'Tech Solutions là công ty công nghệ hàng đầu chuyên phát triển các giải pháp phần mềm sáng tạo cho doanh nghiệp.',
        },
      };

      const mockRelatedJobs = [
        {
          id: 101,
          title: 'React Developer',
          company: 'Digital Agency',
          location: 'Hà Nội',
          salary: '1000$ - 1800$',
          experience: '1-3 năm',
          employmentType: 'full-time',
          published: '2023-06-05',
          expires: '2023-07-05',
        },
        {
          id: 102,
          title: 'Frontend Team Leader',
          company: 'E-commerce Platform',
          location: 'Hà Nội',
          salary: '2000$ - 3000$',
          experience: '5+ năm',
          employmentType: 'full-time',
          published: '2023-06-03',
          expires: '2023-07-03',
        },
        {
          id: 103,
          title: 'UI/UX Developer',
          company: 'Creative Studio',
          location: 'Hồ Chí Minh',
          salary: '1200$ - 2000$',
          experience: '2-4 năm',
          employmentType: 'full-time',
          published: '2023-06-02',
          expires: '2023-07-02',
        },
      ];

      setJob(mockJob);
      setRelatedJobs(mockRelatedJobs);
      setLoading(false);
    }, 700);
  }, [id]);

  // Helper function để format ngày
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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

  if (loading) {
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

  const daysLeft = calculateDaysLeft(job.expires);

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-blue-600">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/jobs" className="text-gray-500 hover:text-blue-600">
            Việc làm
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <div className="mr-4">
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                      <FaBuilding className="text-gray-400 text-3xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                  <Link
                    to={`/companies/${job.company.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {job.company}
                  </Link>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaMoneyBillWave className="mr-2 text-gray-500" />
                      <span>{job.salary || 'Thỏa thuận'}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaClock className="mr-2 text-gray-500" />
                      <span>{getEmploymentTypeText(job.employmentType)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaClock className="mr-2 text-gray-500" />
                      <span>Kinh nghiệm: {job.experience}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-600 mr-4">
                      Đăng ngày: {formatDate(job.published)}
                    </span>
                    {daysLeft > 0 ? (
                      <span className="text-sm text-green-600">
                        Còn {daysLeft} ngày để ứng tuyển
                      </span>
                    ) : (
                      <span className="text-sm text-red-600">Đã hết hạn</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className="btn bg-blue-600 hover:bg-blue-700 text-white">
                  <FaRegBookmark className="mr-2" /> Lưu tin
                </button>
                <button className="btn bg-gray-200 hover:bg-gray-300 text-gray-800">
                  <FaShare className="mr-2" /> Chia sẻ
                </button>
                <button className="btn bg-gray-200 hover:bg-gray-300 text-gray-800">
                  <FaPrint className="mr-2" /> In
                </button>
              </div>
            </div>

            {/* Job Description */}
            <JobDescription job={job} />

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin công ty</h2>
              <div className="flex items-start">
                <div className="mr-4">
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                      <FaBuilding className="text-gray-400 text-3xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link
                      to={`/companies/${job.company.replace(/\s+/g, '-').toLowerCase()}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {job.companyInfo.name}
                    </Link>
                  </h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Website:</span>{' '}
                      <a
                        href={job.companyInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {job.companyInfo.website.replace('https://', '')}
                      </a>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Quy mô:</span> {job.companyInfo.size}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Lĩnh vực:</span> {job.companyInfo.industry}
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{job.companyInfo.description}</p>
                  <div className="mt-4">
                    <Link
                      to={`/companies/${job.company.replace(/\s+/g, '-').toLowerCase()}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Xem thêm về công ty →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Apply Now Button */}
            <ApplyButton jobId={job.id} daysLeft={daysLeft} />

            {/* Related Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Việc làm tương tự</h2>
              <div className="space-y-4">
                {relatedJobs.map((relatedJob) => (
                  <div key={relatedJob.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <Link to={`/jobs/${relatedJob.id}`} className="block">
                      <h3 className="text-blue-600 hover:text-blue-800 font-medium">
                        {relatedJob.title}
                      </h3>
                    </Link>
                    <p className="text-gray-700 text-sm mt-1">{relatedJob.company}</p>
                    <div className="flex items-center text-gray-600 text-sm mt-2">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" />
                      <span>{relatedJob.location}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedJob.salary || 'Thỏa thuận'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem tất cả việc làm →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;