import React from 'react';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-password-page">
      <div className="password-container">
        <ForgotPasswordForm />
        
        <div className="password-image-section">
          <div className="quote">
            <p>"In order to be irreplaceable, one must always be different."</p>
            <cite>- Coco Chanel</cite>
          </div>
          <img src="/assets/images/forgot_password.png" alt="Forgot Password Illustration" className="forgot-password-image" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;