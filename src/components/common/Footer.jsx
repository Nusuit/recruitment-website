// src/components/common/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://facebook.com/myacorp", // Update with actual links
      icon: ["fab", "facebook-f"],
      label: "Facebook",
    },
    {
      href: "https://twitter.com/myacorp",
      icon: ["fab", "twitter"],
      label: "Twitter",
    },
    {
      href: "https://google.com", // Google+ is deprecated, consider another platform or remove
      icon: ["fab", "google"], // Or another relevant icon like 'google-plus-g' if you meant that
      label: "Google",
    },
    {
      href: "https://instagram.com/myacorp",
      icon: ["fab", "instagram"],
      label: "Instagram",
    },
    {
      href: "https://youtube.com/myacorp",
      icon: ["fab", "youtube"],
      label: "YouTube",
    },
  ];

  const applicantLinks = [
    { to: "/jobs", label: "Find Jobs" },
    { to: "/companies", label: "Company List" }, // Assuming a route for company list
    { to: "/career-guide", label: "Career Guide" }, // Assuming a route
    { to: "/salary-reference", label: "Salary Reference" }, // Assuming a route
  ];

  const employerLinks = [
    { to: "/admin/jobs/create", label: "Post Job Openings" },
    { to: "/admin/applicants", label: "Search Resumes" }, // Link to applicant management
    { to: "/pricing", label: "Service Price List" }, // Assuming a pricing page
    { to: "/admin/contact", label: "Contact Us" }, // Assuming an admin contact or use general contact
  ];

  const contactInfo = [
    {
      icon: "map-marker-alt",
      text: "ThuDuc HCM",
      href: "https://maps.google.com/?q=ThuDuc+HCM",
    }, // Example link
    {
      icon: "envelope",
      text: "info@gmail.com",
      href: "mailto:info@gmail.com",
    },
    { icon: "phone", text: "+84 99999999", href: "tel:+8499999999" },
    { icon: "phone", text: "+84 99999999", href: "tel:+8499999999" }, // Assuming two different numbers or a typo in design
  ];

  return (
    <footer className="site-footer text-white">
      {/* Top section with social links */}
      <div className="bg-teal-500 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <span className="text-sm mb-2 sm:mb-0">
            Get connected with us on social networks:
          </span>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <FontAwesomeIcon icon={link.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo and About (Optional, design shows logo here) */}
          <div className="footer-section md:col-span-2 lg:col-span-1">
            <Link to="/" className="footer-logo mb-6 inline-block">
              <img
                src="/assets/images/logo.png" // Use the new logo
                alt="SIUUUcorp Logo"
                className="h-16 w-auto filter brightness-0 invert" // Invert for dark bg
              />
            </Link>
            {/* Optional: Add a short description here if needed */}
          </div>

          {/* Column 2: Applicants */}
          <div className="footer-section">
            <h3 className="text-md font-semibold text-white uppercase tracking-wider mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-teal-500">
              APPLICANTS
            </h3>
            <ul className="space-y-2.5">
              {applicantLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-teal-400 transition-colors duration-200 text-sm text-gray-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Employers */}
          <div className="footer-section">
            <h3 className="text-md font-semibold text-white uppercase tracking-wider mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-teal-500">
              EMPLOYERS
            </h3>
            <ul className="space-y-2.5">
              {employerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-teal-400 transition-colors duration-200 text-sm text-gray-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-section">
            <h3 className="text-md font-semibold text-white uppercase tracking-wider mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-teal-500">
              CONTACT
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-teal-400 mt-1 mr-3 flex-shrink-0"
                  />
                  {item.href ? (
                    <a href={item.href} className="hover:text-teal-400">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Copyright: MyaCorp.com{" "}
            {/* Updated copyright text */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
