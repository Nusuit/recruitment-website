import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const Header = ({ userType = 'guest' }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Base navigation for all user types
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Job Openings', path: '/jobs' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  // Additional links for applicants
  const applicantLinks = [
    { name: 'My Applications', path: '/applicant/applications' },
    { name: 'Saved Jobs', path: '/applicant/saved-jobs' },
  ];
  
  // Additional links for admins
  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Manage Jobs', path: '/admin/jobs' },
    { name: 'Applicants', path: '/admin/applicants' },
  ];
  
  // Determine which links to show based on user type
  const links = 
    userType === 'applicant' ? [...navLinks, ...applicantLinks] :
    userType === 'admin' ? [...navLinks, ...adminLinks] :
    navLinks;
  
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
            {links.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="lang-selector">
          <button className="lang-btn">
            <span className="globe-icon">🌐</span>
          </button>
        </div>
        
        <div className="auth-buttons">
          {user ? (
            <>
              <div className="user-menu">
                <span className="username">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;