import React from 'react';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <div className="reset-password-page">
      <div className="password-container">
        <ResetPasswordForm />
        
        <div className="password-image-section">
          <div className="quote">
            <p>"Fashion fades, only style remains the same."</p>
            <cite>- Coco Chanel</cite>
          </div>
          <img 
            src="/assets/images/illustrations/fashion-atelier.png" 
            alt="Fashion atelier illustration" 
            className="fashion-illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;