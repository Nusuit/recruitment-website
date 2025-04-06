import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ userType = 'guest' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    // Also toggle the "show" class on the main-nav element for mobile displays
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
      mainNav.classList.toggle('show', !mobileMenuOpen);
    }
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="header-container">
      <div className="header-wrapper">
        <div className="logo">
          <Link to="/">
            <img src="/assets/images/logo.svg" alt="MyaCorp Logo" />
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link></li>
            <li><Link to="/jobs" className={location.pathname.startsWith('/jobs') ? 'nav-link active' : 'nav-link'}>Job Openings</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>About Us</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}>Contact</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {userType === 'guest' ? (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <span className="username">{userType}</span>
              <button className="logout-btn">Logout</button>
            </div>
          )}
        </div>
        
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-icon"></span>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Job Openings</Link></li>
          <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
          <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
        </ul>
        
        <div className="mobile-auth-buttons">
          {userType === 'guest' ? (
            <>
              <Link to="/login" className="login-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="signup-btn" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
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