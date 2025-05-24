// src/components/common/Header.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    logout();
    navigate("/login");
    handleMobileLinkClick();
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-teal-500 text-white"
        : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-3 py-3 rounded-md text-base font-medium transition-colors duration-150 ${
      isActive
        ? "bg-teal-500 text-white"
        : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
    }`;

  const commonNavLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Job Openings" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  const renderAuthButtons = (isMobile = false) => {
    const buttonBaseClass = isMobile
      ? "w-full text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
      : "px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200";
    const loginButtonClass = `${buttonBaseClass} bg-teal-500 text-white hover:bg-teal-600`;
    const signupButtonClass = `${buttonBaseClass} bg-white text-teal-600 border border-teal-500 hover:bg-teal-50`;

    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/login"
            className={loginButtonClass}
            onClick={isMobile ? handleMobileLinkClick : undefined}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={signupButtonClass}
            onClick={isMobile ? handleMobileLinkClick : undefined}
          >
            Sign Up
          </Link>
        </>
      );
    } else {
      let dashboardPath = "/";
      if (userRole === "admin") dashboardPath = "/admin/dashboard";
      else if (userRole === "candidate") dashboardPath = "/applicant/dashboard";
      else if (userRole === "recruiter") dashboardPath = "/recruiter/dashboard";

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
                : "font-medium text-gray-700 text-sm hidden lg:inline"
            }
          >
            Hi, {user.firstName || user.name || "User"}!
          </span>
          {userRole !== "guest" && (
            <Link
              to={dashboardPath}
              className={
                isMobile
                  ? `${buttonBaseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`
                  : "px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-md font-medium hover:bg-gray-200"
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
                ? `${buttonBaseClass} bg-red-500 text-white hover:bg-red-600`
                : "px-3 py-1.5 text-xs text-red-600 bg-red-100 rounded-md font-medium hover:bg-red-200 hover:text-red-700 flex items-center"
            }
          >
            <FontAwesomeIcon
              icon="right-from-bracket"
              className={isMobile ? "mr-2" : "mr-1 text-xs"}
            />
            Logout
          </button>
        </div>
      );
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 h-20">
      {" "}
      {/* Increased height */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src="/assets/images/logo.png" // Assuming this is the path to your new logo
              alt="SIUUUcorp Logo" // Updated alt text
              className="h-12 w-auto" // Adjusted logo size
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {commonNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClasses}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
          {/* Language Icon - Placeholder */}
          <button className="text-gray-600 hover:text-teal-600">
            <FontAwesomeIcon icon="globe" />{" "}
            {/* Assuming 'globe' is registered */}
          </button>
        </nav>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-3">
          {renderAuthButtons(false)}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 p-0 relative z-[51] bg-transparent border-none cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <FontAwesomeIcon
            icon={mobileMenuOpen ? "times" : "bars"}
            className="text-2xl text-gray-700"
          />
        </button>
      </div>
      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-20 left-0 right-0 bottom-0 bg-white p-6 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <nav className="flex flex-col space-y-2 mb-6">
          {commonNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={mobileNavLinkClasses}
              onClick={handleMobileLinkClick}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
          <button className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 text-left">
            <FontAwesomeIcon icon="globe" className="mr-2" /> Language
          </button>
        </nav>
        <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
          {renderAuthButtons(true)}
        </div>
      </div>
    </header>
  );
};

export default Header;
