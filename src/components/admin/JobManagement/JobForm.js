// src/components/admin/JobManagement/JobForm.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const JobForm = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: 'draft',
  });
  const [errors, setErrors] = useState({});

  // Nếu có job được truyền vào, set dữ liệu form
  useEffect(() => {
    if (job) {
      setFormData({
        ...formData,
        ...job,
        expiryDate: job.expires ? new Date(job.expires) : formData.expiryDate,
      });
    }
  }, [job]);

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

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      expiryDate: date,
    });
    
    if (errors.expiryDate) {
      setErrors({
        ...errors,
        expiryDate: '',
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      tempErrors.title = 'Vui lòng nhập tiêu đề tin tuyển dụng';
      isValid = false;
    }

    if (!formData.department.trim()) {
      tempErrors.department = 'Vui lòng nhập phòng ban';
      isValid = false;
    }

    if (!formData.location.trim()) {
      tempErrors.location = 'Vui lòng nhập địa điểm làm việc';
      isValid = false;
    }

    if (!formData.experience.trim()) {
      tempErrors.experience = 'Vui lòng nhập yêu cầu kinh nghiệm';
      isValid = false;
    }

    if (!formData.description.trim()) {
      tempErrors.description = 'Vui lòng nhập mô tả công việc';
      isValid = false;
    }

    if (!formData.requirements.trim()) {
      tempErrors.requirements = 'Vui lòng nhập yêu cầu công việc';
      isValid = false;
    }

    if (!formData.expiryDate) {
      tempErrors.expiryDate = 'Vui lòng chọn ngày hết hạn';
      isValid = false;
    } else if (formData.expiryDate < new Date()) {
      tempErrors.expiryDate = 'Ngày hết hạn phải lớn hơn ngày hiện tại';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        expires: formData.expiryDate.toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {job ? 'Chỉnh sửa tin tuyển dụng' : 'Thêm tin tuyển dụng mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề tin tuyển dụng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'border-red-300' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`input-field ${errors.department ? 'border-red-300' : ''}`}
              />
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Địa điểm làm việc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`input-field ${errors.location ? 'border-red-300' : ''}`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                Loại hình công việc <span className="text-red-500">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="full-time">Toàn thời gian</option>
                <option value="part-time">Bán thời gian</option>
                <option value="contract">Hợp đồng</option>
                <option value="temporary">Tạm thời</option>
                <option value="intern">Thực tập</option>
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Kinh nghiệm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Ví dụ: 2-3 năm"
                className={`input-field ${errors.experience ? 'border-red-300' : ''}`}
              />
              {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Mức lương
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Ví dụ: 1000$ - 2000$"
                className="input-field"
              />
              <p className="mt-1 text-xs text-gray-500">Để trống nếu bạn muốn hiển thị "Thỏa thuận"</p>
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Hạn nộp hồ sơ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.expiryDate}
                  onChange={handleDateChange}
                  className={`input-field w-full ${errors.expiryDate ? 'border-red-300' : ''}`}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="draft">Bản nháp</option>
                <option value="active">Đang tuyển</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả công việc <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`input-field ${errors.description ? 'border-red-300' : ''}`}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Yêu cầu công việc <span className="text-red-500">*</span>
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className={`input-field ${errors.requirements ? 'border-red-300' : ''}`}
            ></textarea>
            {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
              Quyền lợi
            </label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={4}
              className="input-field"
            ></textarea>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              <FaSave className="mr-2" /> {job ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;