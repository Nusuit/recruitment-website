// src/pages/client/Profile.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaEdit, FaEye, FaTrash, FaFileAlt, FaCheck, FaTimes, FaCalendarCheck, FaExclamationCircle } from 'react-icons/fa';
import ProfileForm from '../../components/client/Profile/ProfileForm';
import ApplicationStatus from '../../components/client/Profile/ApplicationStatus';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    // Giả lập API call để lấy dữ liệu người dùng
    setTimeout(() => {
      // Mock user data
      const mockUser = {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam',
        avatar: null,
        experience: '5 năm kinh nghiệm Frontend Developer',
        skills: 'HTML, CSS, JavaScript, React, Vue, Angular',
        education: 'Cử nhân Khoa học Máy tính, Đại học Công nghệ (2015-2019)',
        bio: 'Frontend Developer với 5 năm kinh nghiệm, chuyên về xây dựng ứng dụng web với React và Vue.',
        portfolioUrl: 'https://example-portfolio.com',
        githubUrl: 'https://github.com/example',
        linkedinUrl: 'https://linkedin.com/in/example',
      };
      
      // Mock applications data
      const mockApplications = [
        {
          id: 101,
          jobId: 1,
          jobTitle: 'Senior Frontend Developer',
          company: 'Tech Solutions',
          location: 'Hà Nội',
          appliedDate: '2023-06-10',
          status: 'reviewing',
          notes: 'CV đã được xem xét, sẽ liên hệ phỏng vấn trong tuần tới',
          interviewDate: '2023-06-20',
        },
        {
          id: 102,
          jobId: 3,
          jobTitle: 'UI/UX Designer',
          company: 'Creative Agency',
          location: 'Đà Nẵng',
          appliedDate: '2023-06-05',
          status: 'interview',
          notes: 'Phỏng vấn đã được lên lịch vào ngày 15/06/2023 lúc 10:00',
          interviewDate: '2023-06-15',
        },
        {
          id: 103,
          jobId: 5,
          jobTitle: 'DevOps Engineer',
          company: 'Cloud Systems',
          location: 'Hồ Chí Minh',
          appliedDate: '2023-05-25',
          status: 'rejected',
          notes: 'Cảm ơn bạn đã quan tâm, chúng tôi đã tìm được ứng viên phù hợp hơn',
          interviewDate: null,
        },
        {
          id: 104,
          jobId: 6,
          jobTitle: 'Mobile App Developer',
          company: 'AppWorks',
          location: 'Hà Nội',
          appliedDate: '2023-05-20',
          status: 'offered',
          notes: 'Chúc mừng! Bạn đã nhận được lời mời làm việc. Vui lòng kiểm tra email để xem chi tiết.',
          interviewDate: '2023-06-01',
        },
      ];

      setUser(mockUser);
      setApplications(mockApplications);
      setLoading(false);
    }, 500);
  }, []);

  const handleUpdateProfile = (updatedData) => {
    // Giả lập API call để cập nhật thông tin người dùng
    setLoading(true);
    setTimeout(() => {
      setUser({
        ...user,
        ...updatedData,
      });
      setEditMode(false);
      setLoading(false);
    }, 500);
  };

  const handleDeleteApplication = (applicationId) => {
    // Giả lập API call để xóa đơn ứng tuyển
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn ứng tuyển này?')) {
      setLoading(true);
      setTimeout(() => {
        setApplications(applications.filter(app => app.id !== applicationId));
        setLoading(false);
      }, 500);
    }
  };

  if (loading && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col items-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full mb-4 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-blue-600">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 mt-1">{user?.bio}</p>
                
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit className="mr-1" /> Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center p-2 rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="mr-3" /> Hồ sơ của tôi
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`w-full flex items-center p-2 rounded-md ${
                      activeTab === 'applications'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaBriefcase className="mr-3" /> Đơn ứng tuyển
                  </button>
                </nav>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Liên hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaEnvelope className="mt-1 text-gray-500 mr-2" />
                  <span className="text-gray-700">{user?.email}</span>
                </li>
                <li className="flex items-start">
                  <FaPhone className="mt-1 text-gray-500 mr-2" />
                  <span className="text-gray-700">{user?.phone}</span>
                </li>
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 text-gray-500 mr-2" />
                  <span className="text-gray-700">{user?.address}</span>
                </li>
              </ul>
              
              {user?.portfolioUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Liên kết</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href={user.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Portfolio
                      </a>
                    </li>
                    {user.githubUrl && (
                      <li>
                        <a
                          href={user.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          GitHub
                        </a>
                      </li>
                    )}
                    {user.linkedinUrl && (
                      <li>
                        <a
                          href={user.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          LinkedIn
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' ? (
              editMode ? (
                <ProfileForm
                  user={user}
                  onSave={handleUpdateProfile}
                  onCancel={() => setEditMode(false)}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h2>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaEdit className="mr-1" /> Chỉnh sửa
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <FaBriefcase className="mr-2" /> Kinh nghiệm
                      </h3>
                      <p className="text-gray-700">{user?.experience || 'Chưa cập nhật'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <FaGraduationCap className="mr-2" /> Học vấn
                      </h3>
                      <p className="text-gray-700">{user?.education || 'Chưa cập nhật'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <FaFileAlt className="mr-2" /> Kỹ năng
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user?.skills ? (
                          user.skills.split(',').map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded"
                            >
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">Chưa cập nhật</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <FaUser className="mr-2" /> Giới thiệu bản thân
                      </h3>
                      <p className="text-gray-700">{user?.bio || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <ApplicationStatus
                applications={applications}
                onDelete={handleDeleteApplication}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;