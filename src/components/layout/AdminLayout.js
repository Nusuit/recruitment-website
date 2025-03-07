// src/components/layout/AdminLayout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars, FaUserCircle, FaBell, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transform fixed z-30 inset-y-0 left-0 w-64 transition duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 focus:outline-none md:hidden"
              >
                <FaBars className="h-6 w-6" />
              </button>
              <div className="relative mx-4 lg:mx-0">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaSearch className="h-5 w-5 text-gray-500" />
                </span>
                <input
                  className="form-input w-32 sm:w-64 rounded-md pl-10 pr-4 focus:border-indigo-600"
                  type="text"
                  placeholder="Tìm kiếm..."
                />
              </div>
            </div>

            <div className="flex items-center">
              <button className="flex mx-4 text-gray-600 focus:outline-none">
                <FaBell className="h-6 w-6" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none"
                >
                  <FaUserCircle className="h-full w-full text-gray-600" />
                </button>
                {profileDropdownOpen && (
                  <div
                    onClick={() => setProfileDropdownOpen(false)}
                    className="fixed inset-0 h-full w-full z-10"
                  ></div>
                )}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <div className="px-4 py-2 text-xs text-gray-400">{user?.email}</div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                    >
                      Hồ sơ của tôi
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                    >
                      Cài đặt
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Đăng xuất
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;





