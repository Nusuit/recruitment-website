// src/components/layout/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaUserCircle, FaBell, FaSignOutAlt, FaBars, FaTimes, FaHeart, FaBriefcase, FaHome } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Company name - change this to your company's name
  const companyName = "HRMS";  // Changed from "TechCorp" to "HRMS"

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            {companyName} <span className="text-gray-700">Careers</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaHome className="mr-1" /> Home
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaBriefcase className="mr-1" /> Find Jobs
            </Link>
            <Link to="/departments" className="text-gray-700 hover:text-blue-600">
              Departments
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About Us
            </Link>
            {isAuthenticated && (
              <Link to="/saved-jobs" className="text-gray-700 hover:text-blue-600 flex items-center">
                <FaHeart className="mr-1" /> Saved Jobs
              </Link>
            )}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="text-gray-700 hover:text-blue-600">
                  <FaBell className="text-xl" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <FaUserCircle className="text-xl" />
                    <span>{user?.name || 'User'}</span>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/saved-jobs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Saved Jobs
                      </Link>
                      <Link
                        to="/applications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Applications
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Admin Portal
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaHome className="mr-1" /> Home
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-600 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaBriefcase className="mr-1" /> Find Jobs
            </Link>
            <Link
              to="/departments"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Departments
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/saved-jobs"
                  className="text-gray-700 hover:text-blue-600 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaHeart className="mr-1" /> Saved Jobs
                </Link>
                <Link
                  to="/notifications"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-red-500 hover:text-red-700 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </>
            )} : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                to="/register"
                className="btn btn-primary inline-block"
                onClick={() => setMobileMenuOpen(false)}
                >
                Register
              </Link>
            </>
            )
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;