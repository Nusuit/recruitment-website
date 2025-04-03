import React from 'react';
import ContactForm from '../../components/contact/ContactForm';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p className="page-description">
          Any questions or concerns? Just write us a message!
        </p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-icon location-icon"></div>
            <h3>Address</h3>
            <p>123 Fashion Street, District 1</p>
            <p>HCM City, Vietnam</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon phone-icon"></div>
            <h3>Phone</h3>
            <p>+84 999 999 999</p>
            <p>+84 999 999 999</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon email-icon"></div>
            <h3>Email</h3>
            <p>info@myacorp.com</p>
            <p>support@myacorp.com</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon hours-icon"></div>
            <h3>Working Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
          </div>
        </div>
        
        <div className="contact-form-wrapper">
          <ContactForm />
        </div>
      </div>
      
      <div className="contact-map">
        <h2>Find Us On The Map</h2>
        <div className="map-container">
          {/* In a real app, you would embed a Google Map or other map service */}
          <div className="map-placeholder">
            <p>Map goes here</p>
          </div>
        </div>
      </div>
      
      <div className="contact-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>How can I apply for a job?</h3>
            <p>
              You can browse our current job openings and apply directly through our website.
              Each job listing has an "Apply Now" button that will guide you through the application process.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>What happens after I submit my application?</h3>
            <p>
              After submitting your application, our hiring team will review your qualifications.
              If your profile matches our requirements, we'll contact you for the next steps in the recruitment process.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>How can I check the status of my application?</h3>
            <p>
              Once you've created an account and applied for jobs, you can log in to check the status
              of your applications in the "My Applications" section of your dashboard.
            </p>
          </div>
          
          <div className="faq-item">
            <h3>Do you offer remote work opportunities?</h3>
            <p>
              Yes, we do offer remote positions for certain roles. Check the job description or
              use the filters in our job search to find remote opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;