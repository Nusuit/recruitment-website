import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="social-links">
          <p>Get connected with us on social networks:</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
              <i className="fb-icon"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
              <i className="twitter-icon"></i>
            </a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="social-icon google">
              <i className="google-icon"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <i className="instagram-icon"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
              <i className="linkedin-icon"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/assets/images/logo.svg" alt="MyaCorp" />
          </div>
          <div className="company-info">
            <p>Find Jobs</p>
            <p>Company List</p>
            <p>Career Guide</p>
            <p>Salary Reference</p>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>EMPLOYERS</h3>
          <ul className="footer-links">
            <li><Link to="/post-job">Post Job Openings</Link></li>
            <li><Link to="/search-resumes">Search Resumes</Link></li>
            <li><Link to="/pricing">Service Price List</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>CONTACT</h3>
          <ul className="contact-info">
            <li>
              <i className="location-icon"></i>
              <span>MyaCorp HCM</span>
            </li>
            <li>
              <i className="email-icon"></i>
              <span>info@gmail.com</span>
            </li>
            <li>
              <i className="phone-icon"></i>
              <span>+84 999 999 999</span>
            </li>
            <li>
              <i className="phone-icon"></i>
              <span>+84 999 999 999</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 Copyright: <Link to="/">Boxbet.com</Link></p>
      </div>
    </footer>
  );
};

export default Footer;