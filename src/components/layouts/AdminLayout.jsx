import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, MdWork, MdPeople, MdBusiness, 
  MdBarChart, MdMenu, MdClose, MdLogout, MdNotifications, 
  MdSearch, MdKeyboardArrowLeft, MdKeyboardArrowRight
} from 'react-icons/md';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin User"}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Mobile menu button - shown only on mobile */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="company-logo">
            <img src="/assets/images/logo.png" alt="MyaCorp Logo" />
            {!collapsed && <span className="company-name">MyaCorp</span>}
          </div>
          <button 
            className="collapse-btn" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <MdKeyboardArrowRight size={20} /> : <MdKeyboardArrowLeft size={20} />}
          </button>
        </div>

        <div className="admin-info">
          <div className="admin-avatar">
            <img src="/assets/images/admin-avatar.png" alt="Admin Avatar" />
          </div>
          {!collapsed && (
            <div className="admin-details">
              <h3>{user.name}</h3>
              <span className="admin-role">Administrator</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink to="/admin/dashboard" className="nav-link">
                <MdDashboard size={20} />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/jobs" className="nav-link">
                <MdWork size={20} />
                {!collapsed && <span>Jobs Management</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/applicants" className="nav-link">
                <MdPeople size={20} />
                {!collapsed && <span>Applicants</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/company-profile" className="nav-link">
                <MdBusiness size={20} />
                {!collapsed && <span>Company Profile</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/reports" className="nav-link">
                <MdBarChart size={20} />
                {!collapsed && <span>Reports</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <MdLogout size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-content-wrapper">
        <header className="admin-header">
          <div className="header-search">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search..." 
            />
            <MdSearch className="search-icon" size={20} />
          </div>
          <div className="header-actions">
            <div className="notifications-dropdown">
              <button className="notifications-btn">
                <MdNotifications size={24} />
                <span className="notification-badge">3</span>
              </button>
            </div>
            <div className="admin-dropdown">
              <button className="admin-menu-btn">
                <div className="admin-avatar-small">
                  <img src="/assets/images/admin-avatar.png" alt="Admin" />
                </div>
                <span className="admin-name">{user.name}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="admin-main-content">
          {children}
        </div>

        <footer className="admin-footer">
          <div className="admin-footer-content">
            <p>&copy; {new Date().getFullYear()} MyaCorp. All rights reserved.</p>
            <div className="footer-links">
              <a href="/admin/help">Help Center</a>
              <a href="/admin/privacy">Privacy Policy</a>
              <a href="/admin/terms">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;