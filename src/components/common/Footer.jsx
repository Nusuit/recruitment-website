import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/assets/images/logo.png" alt="MyaCorp" />
            </div>
            <p className="company-info">
              Connecting top talent with the best opportunities in the fashion industry. We're dedicated to helping passionate professionals find their dream careers.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Find Jobs</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog & News</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>For Employers</h3>
            <ul className="footer-links">
              <li><Link to="/post-job">Post Job Openings</Link></li>
              <li><Link to="/search-resumes">Search Resumes</Link></li>
              <li><Link to="/pricing">Service Price List</Link></li>
              <li><Link to="/employer-login">Employer Login</Link></li>
              <li><Link to="/success-stories">Success Stories</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>MyaCorp HCM, 123 Fashion Street<br />District 1, Ho Chi Minh City</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@myacorp.com</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+84 999 999 999</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} MyaCorp. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;