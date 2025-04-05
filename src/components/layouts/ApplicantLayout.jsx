import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import AuthContext from '../../contexts/AuthContext';

const ApplicantLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Sidebar menu items
  const menuItems = [
    { label: 'Dashboard', path: '/applicant/dashboard', icon: 'dashboard-icon' },
    { label: 'Find Jobs', path: '/applicant/jobs', icon: 'jobs-icon' },
    { label: 'Saved Jobs', path: '/applicant/saved-jobs', icon: 'saved-icon' },
    { label: 'My Applications', path: '/applicant/applications', icon: 'applications-icon' },
    { label: 'Profile', path: '/applicant/profile', icon: 'profile-icon' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="applicant-layout">
      <Header userType="applicant" />
      
      <div className="layout-container">
        <aside className="sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {/* Default avatar or user's profile picture */}
              <img src="/assets/images/default-avatar.png" alt={user?.name} />
            </div>
            <div className="user-details">
              <h3>{user?.name || 'User'}</h3>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <ul className="nav-menu">
              {menuItems.map((item, index) => (
                <li key={index} className="nav-item">
                  <Link to={item.path} className="nav-link">
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="logout-icon"></i>
              <span>Logout</span>
            </button>
          </div>
        </aside>
        
        <main className="main-content">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default ApplicantLayout;