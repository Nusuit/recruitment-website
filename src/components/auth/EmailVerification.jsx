import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../api/auth';  // Thêm dòng này

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  // Email from location state or default
  const email = location.state?.email || 'your email';
  
  // References for code inputs
  const inputRefs = useRef([]);
  
  // Set up resend timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer]);
  
  // Start initial timer on component mount
  useEffect(() => {
    setTimer(60); // 60 seconds until can resend
    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  // Handle input changes
  const handleChange = (index, value) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;
    
    // Update state
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input if value entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle keydown events
  const handleKeyDown = (index, e) => {
    // If backspace pressed and current field is empty, focus previous field
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    
    const pastedData = e.clipboardData.getData('text');
    const pastedCode = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedCode.length > 0) {
      const newCode = [...verificationCode];
      
      for (let i = 0; i < pastedCode.length; i++) {
        if (i < 6) {
          newCode[i] = pastedCode[i];
        }
      }
      
      setVerificationCode(newCode);
      
      // Focus appropriate field
      if (pastedCode.length < 6 && inputRefs.current[pastedCode.length]) {
        inputRefs.current[pastedCode.length].focus();
      }
    }
  };
  
  // Submit verification code
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const code = verificationCode.join('');
      const result = await authAPI.verifyOTP(email, code);
      
      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/login', {
            state: {
              success: true,
              message: 'Email verified successfully. You can now log in.'
            }
          });
        }, 3000);
      } else {
        setSubmitError(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setSubmitError('Failed to verify email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Resend verification code
  const handleResend = async () => {
    if (!canResend) return;
    
    setSubmitError('');
    setCanResend(false);
    setTimer(60); // Reset timer
    
    try {
      const result = await authAPI.resendOTP(email);
      
      if (result.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        setSubmitError(result.error);
        setCanResend(true);
        setTimer(0);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setSubmitError('Failed to resend verification code');
      setCanResend(true);
      setTimer(0);
    }
  };
  
  return (
    <div className="verification-form-section">
      <div className="brand-logo">
        <img src="/assets/images/logo.png" alt="MyJob" />
        <span>MyJob</span>
      </div>
      
      <div className="verification-header">
        <h2>Email Verification</h2>
        <p>We sent a verification code to <strong>{email}</strong></p>
      </div>
      
      {submitSuccess ? (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h3>Email Verified</h3>
          <p>Your email has been verified successfully!</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <>
          {submitError && <div className="error-message">{submitError}</div>}
          {resendSuccess && (
            <div className="success-message">
              New verification code has been sent to your email
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="verification-form">
            <div className="verification-code">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => (inputRefs.current[index] = el)}
                  required
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className="verify-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </button>
            
            <div className="resend-link">
              {canResend ? (
                <button 
                  type="button"
                  onClick={handleResend}
                  className="resend-button"
                >
                  Resend Code
                </button>
              ) : (
                <span className="timer">
                  Resend code in <strong>{timer}</strong> seconds
                </span>
              )}
            </div>
            
            <div className="form-footer">
              <Link to="/login" className="back-to-login">
                Back to Login
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EmailVerification;