import React from 'react';
import { useLocation } from 'react-router-dom';

const CheckEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';
  
  return (
    <div className="check-email-page">
      <div className="check-email-container">
        <div className="email-icon">📧</div>
        <h2>Check your email</h2>
        <p>
          We have sent a verification link to <strong>{email}</strong>
        </p>
        <p>
          Please check your email and click on the verification link to complete your registration.
        </p>
        <div className="note">
          <p>
            Note: If you don't see the email in your inbox, please check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;