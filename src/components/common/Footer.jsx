import React from 'react';
import { Link } from 'react-router-dom';
import SocialIcons from './SocialIcons';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
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
                <span>info@myacorp.com</span>
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

          <div className="footer-section">
            <h3>FOLLOW US</h3>
            <SocialIcons className="footer-social" size="medium" color="light" />
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MyaCorp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;