// src/components/client/Profile/ProfileForm.js
import React, { useState } from 'react';
import { FaUser, FaBriefcase, FaGraduationCap, FaLink, FaGithub, FaLinkedin } from 'react-icons/fa';

const ProfileForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    experience: user?.experience || '',
    education: user?.education || '',
    skills: user?.skills || '',
    bio: user?.bio || '',
    portfolioUrl: user?.portfolioUrl || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Vui lòng nhập họ tên';
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    }

    if (formData.portfolioUrl && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.portfolioUrl)) {
      tempErrors.portfolioUrl = 'URL không hợp lệ';
      isValid = false;
    }

    if (formData.githubUrl && !/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/?$/.test(formData.githubUrl)) {
      tempErrors.githubUrl = 'GitHub URL không hợp lệ';
      isValid = false;
    }

    if (formData.linkedinUrl && !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(formData.linkedinUrl)) {
      tempErrors.linkedinUrl = 'LinkedIn URL không hợp lệ';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaUser className="mr-1" /> Giới thiệu bản thân
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Giới thiệu ngắn gọn về bản thân..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaBriefcase className="mr-1" /> Kinh nghiệm làm việc
          </label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mô tả kinh nghiệm làm việc của bạn..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaGraduationCap className="mr-1" /> Học vấn
          </label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mô tả quá trình học tập của bạn..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Kỹ năng
          </label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Liệt kê các kỹ năng của bạn, cách nhau bởi dấu phẩy (ví dụ: HTML, CSS, JavaScript, React)"
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">Nhập các kỹ năng cách nhau bởi dấu phẩy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaLink className="mr-1" /> URL Portfolio
            </label>
            <input
              type="url"
              id="portfolioUrl"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.portfolioUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://your-portfolio.com"
            />
            {errors.portfolioUrl && <p className="mt-1 text-sm text-red-600">{errors.portfolioUrl}</p>}
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaGithub className="mr-1" /> GitHub URL
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.githubUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://github.com/username"
            />
            {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>}
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaLinkedin className="mr-1" /> LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.linkedinUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedinUrl && <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;

