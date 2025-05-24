// src/components/common/Header.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Sử dụng NavLink để active class
import { AuthContext } from "../../contexts/AuthContext"; // Đảm bảo đường dẫn đúng
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import PropTypes from 'prop-types'; // Không cần thiết cho functional component nếu không dùng

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserRole(user.role?.toLowerCase() || "guest");
    } else {
      setUserRole("guest");
    }
  }, [isAuthenticated, user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = !mobileMenuOpen ? "hidden" : "";
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
    navigate("/login"); // Điều hướng sau khi logout
    handleMobileLinkClick(); // Đóng mobile menu nếu đang mở
  };

  // NavLink sẽ tự động thêm class 'active'
  const navLinkClasses = ({ isActive }) =>
    `relative py-2 text-gray-800 font-medium no-underline transition-colors duration-200 ${
      isActive
        ? "text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:w-4/5 after:h-0.5 after:bg-blue-600 after:-translate-x-1/2"
        : "hover:text-blue-600 hover:after:w-4/5 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:-translate-x-1/2"
    }`;

  const mobileNavLinkClasses =
    "block py-3 text-gray-800 font-medium text-lg no-underline border-b border-gray-200";

  const renderAuthButtons = (isMobile = false) => {
    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/login"
            className={
              isMobile
                ? "px-4 py-3 text-blue-600 border border-blue-600 rounded font-medium text-center no-underline transition-colors duration-200 hover:bg-blue-50 w-full block"
                : "px-4 py-2 text-blue-600 border border-blue-600 rounded font-medium transition-colors duration-200 hover:bg-blue-50"
            }
            onClick={isMobile ? handleMobileLinkClick : undefined}
          >
            Đăng nhập
          </Link>
          <Link
            to="/signup"
            className={
              isMobile
                ? "px-4 py-3 bg-blue-600 text-white border border-blue-600 rounded font-medium text-center no-underline transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700 w-full block"
                : "px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded font-medium transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700"
            }
            onClick={isMobile ? handleMobileLinkClick : undefined}
          >
            Đăng ký
          </Link>
        </>
      );
    } else {
      let dashboardPath = "/";
      if (userRole === "admin") dashboardPath = "/admin/dashboard";
      else if (userRole === "candidate") dashboardPath = "/applicant/dashboard";
      else if (userRole === "recruiter") dashboardPath = "/recruiter/dashboard"; // Giả sử có role recruiter

      return (
        <div
          className={
            isMobile ? "flex flex-col space-y-3" : "flex items-center space-x-3"
          }
        >
          <span
            className={
              isMobile
                ? "text-gray-800 font-medium text-lg py-2 text-center"
                : "font-medium text-gray-800 hidden md:inline"
            }
          >
            Chào, {user.firstName || user.name || "User"}
          </span>
          {userRole !== "guest" && (
            <Link
              to={dashboardPath}
              className={
                isMobile
                  ? "px-4 py-3 bg-gray-200 text-gray-700 rounded font-medium text-center no-underline transition-colors duration-200 hover:bg-gray-300 w-full block"
                  : "px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded font-medium transition-colors duration-200 hover:bg-gray-200"
              }
              onClick={isMobile ? handleMobileLinkClick : undefined}
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className={
              isMobile
                ? "px-4 py-3 bg-red-500 text-white rounded font-medium text-center transition-colors duration-200 hover:bg-red-600 w-full block"
                : "px-3 py-1.5 text-sm text-red-600 bg-red-100 rounded font-medium transition-colors duration-200 hover:bg-red-200 hover:text-red-700"
            }
          >
            <FontAwesomeIcon icon="right-from-bracket" className="mr-1" />
            Đăng xuất
          </button>
        </div>
      );
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 h-16">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src="/assets/images/logo.png" // Đảm bảo đường dẫn này đúng
              alt="MyaCorp Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center ml-auto mr-6">
          <ul className="flex space-x-6 list-none m-0 p-0">
            <li>
              <NavLink to="/" className={navLinkClasses} end>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={navLinkClasses}>
                Cơ hội việc làm
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClasses}>
                Về chúng tôi
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClasses}>
                Liên hệ
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
          {renderAuthButtons(false)}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 p-0 relative z-[51] bg-none border-none cursor-pointer" // Tăng z-index
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <FontAwesomeIcon
            icon={mobileMenuOpen ? "times" : "bars"}
            className="text-2xl text-gray-800"
          />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 left-0 right-0 bottom-0 bg-white p-6 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden overflow-y-auto`}
      >
        <ul className="list-none m-0 p-0 mb-6">
          <li>
            <Link
              to="/"
              onClick={handleMobileLinkClick}
              className={mobileNavLinkClasses}
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              onClick={handleMobileLinkClick}
              className={mobileNavLinkClasses}
            >
              Cơ hội việc làm
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={handleMobileLinkClick}
              className={mobileNavLinkClasses}
            >
              Về chúng tôi
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={handleMobileLinkClick}
              className={mobileNavLinkClasses}
            >
              Liên hệ
            </Link>
          </li>
        </ul>

        <div className="flex flex-col space-y-4 mt-6">
          {renderAuthButtons(true)}
        </div>
      </div>
    </header>
  );
};

// Header.propTypes = {
//   userType: PropTypes.string, // Vẫn có thể giữ lại nếu bạn truyền userType từ bên ngoài
// };

// Header.defaultProps = {
//   userType: "guest", // Sẽ bị ghi đè bởi logic useEffect
// };

export default Header; // Không cần withRouter nữa
