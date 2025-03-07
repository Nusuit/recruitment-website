// src/components/client/Application/ApplicationForm.js
import React, { useState } from 'react';
import { FaUpload, FaTrash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import CVUpload from './CVUpload';

const ApplicationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    coverLetter: '',
    cv: null,
    portfolio: '',
    education: '',
    experience: '',
    skills: '',
    expectedSalary: '',
    availableDate: '',
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

  const handleCVUpload = (file) => {
    setFormData({
      ...formData,
      cv: file,
    });

    if (errors.cv) {
      setErrors({
        ...errors,
        cv: '',
      });
    }
  };

  const handleCVRemove = () => {
    setFormData({
      ...formData,
      cv: null,
    });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Vui lòng nhập họ tên';
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
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      tempErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    if (!formData.cv) {
      tempErrors.cv = 'Vui lòng tải lên CV của bạn';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin ứng tuyển</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
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
          <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
            CV của bạn <span className="text-red-500">*</span>
          </label>
          <CVUpload
            onUpload={handleCVUpload}
            onRemove={handleCVRemove}
            file={formData.cv}
            error={errors.cv}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio URL (nếu có)
          </label>
          <input
            type="url"
            id="portfolio"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="https://your-portfolio.com"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Thư xin việc
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn muốn ứng tuyển vị trí này"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
              Học vấn
            </label>
            <textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: Cử nhân Khoa học Máy tính, Đại học ABC (2015-2019)"
            ></textarea>
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Kinh nghiệm làm việc
            </label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: Frontend Developer, Công ty XYZ (2019-2022)"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
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
              placeholder="Ví dụ: HTML, CSS, JavaScript, React, Node.js, v.v."
            ></textarea>
          </div>

          <div>
            <div className="mb-3">
              <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-1">
                Mức lương mong muốn
              </label>
              <input
                type="text"
                id="expectedSalary"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: 1500$ - 2000$"
              />
            </div>

            <div>
              <label htmlFor="availableDate" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày có thể bắt đầu làm việc
              </label>
              <input
                type="text"
                id="availableDate"
                name="availableDate"
                value={formData.availableDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Ngay lập tức, sau 2 tuần, 01/07/2023"
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Bằng cách nhấn nút "Gửi đơn ứng tuyển", bạn đồng ý rằng chúng tôi có thể chia sẻ thông tin của bạn với nhà tuyển dụng.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Gửi đơn ứng tuyển'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;

