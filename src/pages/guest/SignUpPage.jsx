import React from 'react';
import SignUpForm from '../../components/auth/SignUpForm';

const SignUpPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <SignUpForm />
        
        <div className="signup-image-section">
          <div className="quote">
            <p>"Fashion is the armor to survive the reality of everyday life."</p>
            <cite>- Bill Cunningham</cite>
          </div>
          <img 
            src="/assets/images/illustrations/fashion-designers.png" 
            alt="Fashion designers illustration" 
            className="fashion-illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;