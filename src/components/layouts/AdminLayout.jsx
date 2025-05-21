import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom"; // Import withRouter
import {
  MdDashboard,
  MdWork,
  MdPeople,
  MdBusiness,
  MdBarChart,
  MdMenu,
  MdClose,
  MdLogout,
  MdNotifications,
  MdSearch,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import PropTypes from "prop-types";

class AdminLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mobileMenuOpen: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
  }

  handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Ensure token is also removed
    this.props.history.push("/login"); // Use history for navigation
  }

  toggleSidebar() {
    this.setState((prevState) => ({ collapsed: !prevState.collapsed }));
  }

  toggleMobileMenu() {
    this.setState((prevState) => ({
      mobileMenuOpen: !prevState.mobileMenuOpen,
    }));
  }

  render() {
    const { collapsed, mobileMenuOpen } = this.state;
    const user = JSON.parse(
      localStorage.getItem("user") || '{"name": "Admin User", "role": "admin"}'
    ); // Placeholder user

    return (
      <div
        className={`flex min-h-screen relative ${
          collapsed ? "admin-layout-collapsed" : ""
        }`}
      >
        {/* Mobile menu button - shown only on mobile */}
        <button
          className="md:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-colors duration-200 hover:bg-blue-700"
          onClick={this.toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out z-40 shadow-xl overflow-y-auto overflow-x-hidden
          ${collapsed ? "w-20" : "w-72"}
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/logo.png"
                alt="MyaCorp Logo"
                className="h-8 w-auto filter invert"
              />
              {!collapsed && (
                <span className="text-lg font-semibold text-white whitespace-nowrap">
                  MyaCorp
                </span>
              )}
            </div>
            <button
              className="bg-none border-none text-white cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800"
              onClick={this.toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <MdKeyboardArrowRight size={20} />
              ) : (
                <MdKeyboardArrowLeft size={20} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 p-4 border-b border-gray-800">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700">
              <img
                src="/assets/images/admin-avatar.png"
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <h3 className="font-semibold text-base text-white whitespace-nowrap">
                  {user.name}
                </h3>
                <span className="text-sm text-gray-400">Quản trị viên</span>
              </div>
            )}
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="list-none p-0 m-0">
              <li className="mb-0.5">
                <NavLink
                  to="/admin/dashboard"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdDashboard size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">Tổng quan</span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/jobs"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdWork size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">Quản lý việc làm</span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/applicants"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdPeople size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">Ứng viên</span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/company-profile"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdBusiness size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">Hồ sơ công ty</span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/reports"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdBarChart size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">Báo cáo</span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/settings"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdBarChart size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">Cài đặt</span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/users"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdPeople size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      Quản lý người dùng
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/roles"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdWork size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">Quản lý vai trò</span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/analytics/jobs"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdBarChart size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      Phân tích việc làm
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/analytics/applicants"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdPeople size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      Phân tích ứng viên
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="mb-0.5">
                <NavLink
                  to="/admin/analytics/recruitment"
                  className="flex items-center gap-3 py-3 px-4 text-gray-300 no-underline transition-all duration-200 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
                  activeClassName="bg-gray-800 text-white border-blue-600"
                >
                  <MdBarChart size={20} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      Phân tích tuyển dụng
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              className="flex items-center gap-3 w-full py-3 px-4 bg-transparent border-none text-gray-300 cursor-pointer transition-colors duration-200 rounded hover:bg-red-800 hover:text-white"
              onClick={this.handleLogout}
            >
              <MdLogout size={20} />
              {!collapsed && (
                <span className="whitespace-nowrap">Đăng xuất</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col bg-gray-50 transition-all duration-300 ease-in-out
          ${
            collapsed
              ? "ml-20 w-[calc(100%-80px)]"
              : "ml-72 w-[calc(100%-288px)]"
          }
        `}
        >
          <header className="h-16 bg-white shadow-md flex justify-between items-center px-6 sticky top-0 z-20">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="Tìm kiếm..."
              />
              <MdSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="bg-none border-none relative cursor-pointer p-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                  <MdNotifications size={24} />
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center gap-2 bg-none border-none cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src="/assets/images/admin-avatar.png"
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            {this.props.children} {/* Render children passed from Route */}
          </main>

          <footer className="bg-white border-t border-gray-200">
            <div className="flex justify-between items-center max-w-screen-xl mx-auto px-6 py-4 text-sm text-gray-600 flex-wrap gap-3">
              <p>
                &copy; {new Date().getFullYear()} MyaCorp. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a
                  href="/admin/help"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 no-underline"
                >
                  Trung tâm trợ giúp
                </a>
                <a
                  href="/admin/privacy"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 no-underline"
                >
                  Chính sách bảo mật
                </a>
                <a
                  href="/admin/terms"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 no-underline"
                >
                  Điều khoản dịch vụ
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

AdminLayout.propTypes = {
  history: PropTypes.object.isRequired, // Injected by withRouter
  location: PropTypes.object.isRequired, // Injected by withRouter
  match: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(AdminLayout);
