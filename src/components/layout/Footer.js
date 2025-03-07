// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JobRecruit</h3>
            <p className="text-gray-300 mb-4">
              Nền tảng kết nối ứng viên và nhà tuyển dụng hàng đầu Việt Nam
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-blue-400">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-blue-400">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-blue-400">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Ứng viên</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-300 hover:text-white">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-300 hover:text-white">
                  Danh sách công ty
                </Link>
              </li>
              <li>
                <Link to="/career-advice" className="text-gray-300 hover:text-white">
                  Cẩm nang nghề nghiệp
                </Link>
              </li>
              <li>
                <Link to="/salary" className="text-gray-300 hover:text-white">
                  Tham khảo mức lương
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Nhà tuyển dụng</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/employer" className="text-gray-300 hover:text-white">
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/resume-search" className="text-gray-300 hover:text-white">
                  Tìm kiếm hồ sơ
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white">
                  Bảng giá dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Liên hệ với chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Số 1 Đường ABC, Quận XYZ, Hà Nội</li>
              <li>Điện thoại: (84) 123 456 789</li>
              <li>Email: contact@jobrecruit.com</li>
              <li>Giờ làm việc: 8:00 - 17:30, Thứ Hai - Thứ Sáu</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} JobRecruit. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;