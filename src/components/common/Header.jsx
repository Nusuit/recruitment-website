import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ userType = 'guest' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="header-wrapper">
        <div className="logo">
          <Link to="/">
            <img src="/assets/images/logo.svg" alt="MyaCorp Logo" />
          </Link>
        </div>
        
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span className="hamburger-icon"></span>
        </button>
        
        <nav className={`main-nav ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/jobs" className="nav-link">Job Openings</Link></li>
            <li><Link to="/about" className="nav-link">About Us</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>
        </nav>
        
        <div className="lang-selector">
          <button className="lang-btn">
            <span className="globe-icon">🌐</span>
          </button>
        </div>
        
        <div className="auth-buttons">
          {userType === 'guest' ? (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <span className="username">User</span>
              <button className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/jobs">Job Openings</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        
        <div className="mobile-auth-buttons">
          {userType === 'guest' ? (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          ) : (
            <button className="logout-btn">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;