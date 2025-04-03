import React from 'react';
import EmailVerification from '../../components/auth/EmailVerification';

const EmailVerificationPage = () => {
  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <EmailVerification />
        
        <div className="verification-image-section">
          <div className="quote">
            <p>"Life isn't perfect, but your outfit can be."</p>
            <cite>- Unknown</cite>
          </div>
          <img 
            src="/assets/images/illustrations/fashion-workspace.png" 
            alt="Fashion workspace illustration" 
            className="fashion-illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;