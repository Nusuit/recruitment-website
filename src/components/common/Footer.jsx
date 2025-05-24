// src/components/common/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Ensure you have these brand icons in your fontawesome.js setup
// import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
// And solid icons
// import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://facebook.com",
      icon: ["fab", "facebook-f"],
      label: "Facebook",
    },
    { href: "https://twitter.com", icon: ["fab", "twitter"], label: "Twitter" },
    {
      href: "https://linkedin.com",
      icon: ["fab", "linkedin-in"],
      label: "LinkedIn",
    },
    {
      href: "https://instagram.com",
      icon: ["fab", "instagram"],
      label: "Instagram",
    },
  ];

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Find Jobs" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    // { to: "/blog", label: "Blog & News" }, // Uncomment if you have these pages
    // { to: "/faqs", label: "FAQs" },
  ];

  const employerLinks = [
    { to: "/admin/jobs/create", label: "Post Job Openings" }, // Adjusted for admin path
    // { to: "/search-resumes", label: "Search Resumes" },
    // { to: "/pricing", label: "Service Price List" },
    { to: "/admin/dashboard", label: "Employer Dashboard" }, // Adjusted for admin path
    // { to: "/success-stories", label: "Success Stories" },
  ];

  return (
    <footer className="site-footer bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo and About */}
          <div className="footer-section">
            <Link to="/" className="footer-logo mb-6 inline-block">
              <img
                src="/assets/images/logo.png"
                alt="MyaCorp Logo"
                className="h-10 filter brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Connecting top talent with the best opportunities in the fashion
              industry. We're dedicated to helping passionate professionals find
              their dream careers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-9 h-9 bg-gray-700 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Employers */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              For Employers
            </h3>
            <ul className="space-y-2.5">
              {employerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="map-marker-alt"
                  className="text-blue-500 mt-1 mr-3 flex-shrink-0"
                />
                <span>
                  MyaCorp HCM, 123 Fashion Street, District 1, Ho Chi Minh City,
                  Vietnam
                </span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon="envelope"
                  className="text-blue-500 mr-3 flex-shrink-0"
                />
                <a
                  href="mailto:info@myacorp.com"
                  className="hover:text-blue-400"
                >
                  info@myacorp.com
                </a>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon="phone"
                  className="text-blue-500 mr-3 flex-shrink-0"
                />
                <a href="tel:+84999999999" className="hover:text-blue-400">
                  +84 999 999 999
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom border-t border-gray-700 pt-8 mt-8 text-center md:text-left md:flex md:justify-between md:items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} MyaCorp. All rights reserved. Designed with
            passion.
          </p>
          <div className="flex justify-center md:justify-start space-x-5">
            <Link
              to="/privacy"
              className="text-xs text-gray-500 hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-gray-500 hover:text-blue-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
