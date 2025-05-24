// src/components/layouts/AdminLayout.jsx
import React, { useState, useContext } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../common/Header"; // Admin có thể có Header riêng hoặc dùng chung

// Mảng các mục menu cho Admin
const adminMenuItems = [
  { label: "Tổng quan", path: "/admin/dashboard", icon: "gauge-high" },
  { label: "Quản lý việc làm", path: "/admin/jobs", icon: "briefcase" },
  { label: "Quản lý ứng viên", path: "/admin/applicants", icon: "users" },
  { label: "Hồ sơ công ty", path: "/admin/company-profile", icon: "building" },
  { label: "Báo cáo", path: "/admin/reports", icon: "chart-pie" },
  { label: "Cài đặt", path: "/admin/settings", icon: "cog" },
  { label: "Quản lý người dùng", path: "/admin/users", icon: "user-shield" },
  { label: "Quản lý vai trò", path: "/admin/roles", icon: "tasks" }, // Thay icon tasks bằng một icon phù hợp hơn nếu có
  { label: "Hồ sơ cá nhân", path: "/admin/profile", icon: "user-circle" }, // Icon cho profile admin
  // Thêm các mục phân tích
  {
    label: "Phân tích việc làm",
    path: "/admin/analytics/jobs",
    icon: "chart-line",
  },
  {
    label: "Phân tích ứng viên",
    path: "/admin/analytics/applicants",
    icon: "chart-bar",
  }, // faChartBar
  {
    label: "Phân tích tuyển dụng",
    path: "/admin/analytics/recruitment",
    icon: "magnifying-glass-chart",
  }, // faSearchDollar hoặc tương tự
];

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Mặc định mở

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all duration-200 ${
      isActive ? "bg-blue-600 text-white" : "" // Active class cho NavLink
    } ${sidebarOpen ? "" : "justify-center"}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin có thể có Header riêng hoặc không dùng Header chung */}
      {/* <Header userType="admin" />  */}
      <div className="flex flex-1">
        {" "}
        {/* Loại bỏ pt-16 nếu không dùng Header chung */}
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col z-40 shadow-lg transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-72" : "w-20"
          }`}
        >
          <div
            className={`flex items-center p-4 border-b border-gray-700 ${
              sidebarOpen ? "justify-between" : "justify-center h-16"
            }`}
          >
            {sidebarOpen && (
              <NavLink
                to="/admin/dashboard"
                className="flex items-center gap-2"
              >
                <img
                  src="/assets/images/logo.png" // Đảm bảo đường dẫn đúng
                  alt="MyaCorp Logo"
                  className="h-8 w-auto filter invert"
                />
                <span className="text-lg font-semibold text-white">
                  MyaCorp Admin
                </span>
              </NavLink>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <FontAwesomeIcon
                icon={sidebarOpen ? "chevron-left" : "chevron-right"}
              />
            </button>
          </div>

          {sidebarOpen && user && (
            <div className="flex items-center gap-3 p-4 border-b border-gray-700">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
                <img
                  src={user.avatar || "/assets/images/admin-avatar.png"} // Sử dụng user.avatar
                  alt={user.firstName || user.name || "Admin"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white truncate">
                  {user.firstName || user.name || "Admin"}
                </h3>
                <span className="text-xs text-gray-400 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="list-none p-0 m-0">
              {adminMenuItems.map((item) => (
                <li key={item.path} className="mb-0.5">
                  <NavLink
                    to={item.path}
                    className={navLinkClasses}
                    end={item.path === "/admin/dashboard"} // `end` prop cho NavLink
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`flex-shrink-0 ${
                        sidebarOpen ? "w-5 h-5" : "w-6 h-6 mx-auto"
                      }`}
                    />
                    {sidebarOpen && (
                      <span className="whitespace-nowrap">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`p-4 border-t border-gray-700 ${
              sidebarOpen ? "" : "flex justify-center"
            }`}
          >
            <button
              className={`flex items-center gap-3 w-full py-3 px-4 bg-transparent border-none text-gray-300 hover:text-red-400 font-medium cursor-pointer transition-all duration-200 rounded hover:bg-gray-700 ${
                sidebarOpen ? "" : "justify-center"
              }`}
              onClick={handleLogout}
            >
              <FontAwesomeIcon
                icon="right-from-bracket"
                className={`flex-shrink-0 ${
                  sidebarOpen ? "w-5 h-5" : "w-6 h-6 mx-auto"
                }`}
              />
              {sidebarOpen && (
                <span className="whitespace-nowrap">Đăng xuất</span>
              )}
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "ml-72" : "ml-20"
          }`}
        >
          {/* Admin Header (nếu có, có thể khác với Header chung) */}
          <header className="h-16 bg-white shadow-md flex justify-between items-center px-6 sticky top-0 z-30">
            <div className="text-xl font-semibold text-gray-800">
              {/* Tên trang hiện tại có thể hiển thị ở đây */}
              {adminMenuItems.find(
                (item) =>
                  location.pathname.startsWith(item.path) &&
                  (item.path !== "/admin/dashboard" ||
                    location.pathname === "/admin/dashboard")
              )?.label || "Admin Panel"}
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-200">
                <FontAwesomeIcon icon="bell" className="text-gray-600" />
                {/* Badge thông báo có thể thêm ở đây */}
              </button>
              <div className="flex items-center gap-2">
                <img
                  src={user?.avatar || "/assets/images/admin-avatar.png"}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.firstName || user?.name || "Admin"}
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
          <footer className="bg-white py-4 px-6 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MyaCorp Admin Panel. All rights
            reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
