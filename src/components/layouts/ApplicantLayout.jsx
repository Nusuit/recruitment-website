// src/components/layouts/ApplicantLayout.jsx
import React, { useContext, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import PropTypes from 'prop-types'; // Không cần thiết

const ApplicantLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Để xác định active link
  const [sidebarOpen, setSidebarOpen] = useState(true); // State cho sidebar collapse/expand

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { label: "Tổng quan", path: "/applicant/dashboard", icon: "gauge-high" },
    { label: "Tìm việc", path: "/applicant/jobs", icon: "briefcase" },
    {
      label: "Việc làm đã lưu",
      path: "/applicant/saved-jobs",
      icon: "bookmark",
    },
    {
      label: "Đơn ứng tuyển",
      path: "/applicant/applications",
      icon: "file-alt",
    },
    { label: "Hồ sơ", path: "/applicant/profile", icon: "user" },
  ];

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-blue-600 font-medium rounded transition-all duration-200 ${
      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
    }`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Header sẽ tự quản lý userType */}
      <div className="flex flex-1 pt-16">
        {" "}
        {/* pt-16 để không bị header che */}
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-4 z-30 overflow-y-auto transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-72" : "w-20"
          }`}
        >
          <div
            className={`flex items-center gap-3 p-1 mb-4 border-b border-gray-200 ${
              sidebarOpen ? "justify-between" : "justify-center"
            }`}
          >
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={user?.avatar || "/assets/images/default-avatar.png"} // Sử dụng user.avatar nếu có
                    alt={user?.firstName || user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-md font-semibold text-gray-800 truncate">
                    {user?.firstName || user?.name || "Ứng viên"}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <FontAwesomeIcon
                icon={sidebarOpen ? "chevron-left" : "chevron-right"}
              />
            </button>
          </div>

          <nav className="mb-6">
            <ul className="list-none p-0 m-0">
              {menuItems.map((item) => (
                <li key={item.path} className="mb-0.5">
                  <NavLink
                    to={item.path}
                    className={navLinkClasses}
                    end={item.path === "/applicant/dashboard"}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`w-5 h-5 flex-shrink-0 ${
                        sidebarOpen ? "" : "mx-auto"
                      }`}
                    />
                    {sidebarOpen && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`p-1 border-t border-gray-200 ${
              sidebarOpen ? "" : "flex justify-center"
            }`}
          >
            <button
              className={`flex items-center gap-3 w-full py-3 px-4 bg-transparent border-none text-gray-700 hover:text-red-600 font-medium cursor-pointer transition-all duration-200 rounded hover:bg-red-100 ${
                sidebarOpen ? "" : "justify-center"
              }`}
              onClick={handleLogout}
            >
              <FontAwesomeIcon
                icon="right-from-bracket"
                className={`w-5 h-5 flex-shrink-0 ${
                  sidebarOpen ? "" : "mx-auto"
                }`}
              />
              {sidebarOpen && <span>Đăng xuất</span>}
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main
          className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "ml-72" : "ml-20"
          } p-6`}
        >
          <Outlet /> {/* Nội dung các trang con của applicant */}
        </main>
      </div>
      {/* Footer có thể không cần thiết trong layout có sidebar cố định, hoặc đặt bên ngoài div này */}
      {/* <Footer /> */}
    </div>
  );
};

export default ApplicantLayout;
