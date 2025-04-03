import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sidebar menu items
  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard-icon' },
    { label: 'Job Management', path: '/admin/jobs', icon: 'jobs-icon' },
    { label: 'Applicants', path: '/admin/applicants', icon: 'applicants-icon' },
    { label: 'Company Profile', path: '/admin/company-profile', icon: 'company-icon' },
    { label: 'Reports', path: '/admin/reports', icon: 'reports-icon' },
  ];

  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="company-logo">
            <img src="/assets/images/logo.svg" alt="MyaCorp" />
            {!sidebarCollapsed && <span className="company-name">MyaCorp</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`collapse-icon ${sidebarCollapsed ? 'expand' : 'collapse'}`}></i>
          </button>
        </div>
        
        <div className="admin-info">
          <div className="admin-avatar">
            <img src="/assets/images/admin-avatar.png" alt={user?.name} />
          </div>
          
          {!sidebarCollapsed && (
            <div className="admin-details">
              <h3>{user?.name || 'Admin'}</h3>
              <p className="admin-role">Administrator</p>
            </div>
          )}
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item, index) => (
              <li 
                key={index} 
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Link to={item.path} className="nav-link">
                  <i className={item.icon}></i>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="logout-icon"></i>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      
      <div className="admin-content-wrapper">
        <header className="admin-header">
          <div className="header-search">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
          </div>
          
          <div className="header-actions">
            <div className="notifications-dropdown">
              <button className="notifications-btn">
                <i className="notifications-icon"></i>
                <span className="notification-badge">3</span>
              </button>
            </div>
            
            <div className="admin-dropdown">
              <button className="admin-menu-btn">
                <img 
                  src="/assets/images/admin-avatar.png" 
                  alt={user?.name} 
                  className="admin-avatar-small"
                />
                <span className="admin-name">{user?.name || 'Admin'}</span>
                <i className="dropdown-arrow"></i>
              </button>
            </div>
          </div>
        </header>
        
        <main className="admin-main-content">
          <Outlet />
        </main>
        
        <footer className="admin-footer">
          <p>© 2025 MyaCorp Admin Panel. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;