// src/components/layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <FaTachometerAlt />,
    },
    {
      path: '/admin/jobs',
      name: 'Quản lý tuyển dụng',
      icon: <FaBriefcase />,
    },
    {
      path: '/admin/candidates',
      name: 'Quản lý ứng viên',
      icon: <FaUsers />,
    },
    {
      path: '/admin/interviews',
      name: 'Lịch phỏng vấn',
      icon: <FaCalendarAlt />,
    },
    {
      path: '/admin/reports',
      name: 'Báo cáo',
      icon: <FaChartBar />,
    },
    {
      path: '/admin/settings',
      name: 'Cài đặt',
      icon: <FaCog />,
    },
  ];

  return (
    <div className="bg-gray-800 text-white h-full w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">JobRecruit</h1>
        <p className="text-gray-400 text-sm mt-1">Trang quản trị</p>
      </div>

      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3">
            <p className="font-medium">{user?.name || 'Admin'}</p>
            <p className="text-sm text-gray-400">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
      </div>

      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
                    isActive ? 'bg-gray-700 text-white' : ''
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <span className="mr-3"><FaSignOutAlt /></span>
              Đăng xuất
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;