import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Import CSS module nếu bạn dùng CSS Modules, hoặc CSS thường như hiện tại
// import styles from './Header.module.css'; // Ví dụ nếu dùng CSS Modules
import '../../styles/components/header.css'; // Đường dẫn tới file CSS
import searchIcon from '../../../public/assets/images/icons/search.svg'; // Ví dụ nếu cần icon search
import chevronIcon from '../../../public/assets/images/icons/chevron.svg'; // Ví dụ nếu cần icon chevron

const Header = ({ userType = 'guest' }) => { // Mặc định là guest nếu không truyền prop
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevOpen => !prevOpen); // Dùng callback để đảm bảo state mới nhất
  };

  // Ngăn cuộn trang khi mobile menu mở
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; // Reset về mặc định của trình duyệt
    }

    // Cleanup function để đảm bảo overflow được reset khi component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Hàm xử lý đóng menu khi click link trên mobile
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Hàm xử lý logout (bạn cần tự định nghĩa logic logout thực tế)
  const handleLogout = () => {
    console.log("Logging out...");
    // Thêm logic logout ở đây (xóa token, gọi API, redirect, ...)
    setMobileMenuOpen(false); // Đóng menu nếu đang mở
  };

  // Helper function để kiểm tra active link
  const isNavLinkActive = (path) => {
    if (path === '/jobs') {
      // Chỉ active khi đúng là /jobs hoặc bắt đầu bằng /jobs/ (tùy yêu cầu)
      return location.pathname === path || location.pathname.startsWith(path + '/');
      // Hoặc chỉ active khi đúng là /jobs: return location.pathname === path;
    }
    return location.pathname === path;
  };

  return (
    // Sử dụng class từ CSS (hoặc styles.headerContainer nếu dùng CSS Modules)
    <header className="header-container">
      <div className="header-wrapper">
        <div className="logo">
          <Link to="/">
            {/* Nhớ thay đổi src và alt phù hợp */}
            <img src="/assets/images/logo.png" alt="Your Logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="main-nav">
          <ul className="nav-links">
            <li><Link to="/" className={`nav-link ${isNavLinkActive('/') ? 'active' : ''}`}>Home</Link></li>
            <li><Link to="/jobs" className={`nav-link ${isNavLinkActive('/jobs') ? 'active' : ''}`}>Job Openings</Link></li>
            <li><Link to="/about" className={`nav-link ${isNavLinkActive('/about') ? 'active' : ''}`}>About Us</Link></li>
            <li><Link to="/contact" className={`nav-link ${isNavLinkActive('/contact') ? 'active' : ''}`}>Contact</Link></li>
          </ul>
        </nav>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="auth-actions">
          {userType === 'guest' ? (
            <>
              {/* Sử dụng class chung và class riêng */}
              <Link to="/login" className="header-btn login-btn">Login</Link>
              <Link to="/signup" className="header-btn signup-btn">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              {/* Hiển thị tên user hoặc avatar */}
              <span className="username">{userType}</span>
              {/* Nút logout */}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen} // Thêm aria-expanded cho accessibility
        >
          <span className="hamburger-icon"></span>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {/* Thêm onClick để đóng menu khi click link */}
          <li><Link to="/" onClick={handleMobileLinkClick}>Home</Link></li>
          <li><Link to="/jobs" onClick={handleMobileLinkClick}>Job Openings</Link></li>
          <li><Link to="/about" onClick={handleMobileLinkClick}>About Us</Link></li>
          <li><Link to="/contact" onClick={handleMobileLinkClick}>Contact</Link></li>
        </ul>

        <div className="mobile-auth-buttons">
          {userType === 'guest' ? (
            <>
              <Link to="/login" className="header-btn login-btn" onClick={handleMobileLinkClick}>Login</Link>
              <Link to="/signup" className="header-btn signup-btn" onClick={handleMobileLinkClick}>Sign Up</Link>
            </>
          ) : (
            // Sử dụng button thay vì Link cho logout
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
