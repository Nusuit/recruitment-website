import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { validateForgotPasswordForm } from '../../utils/validators';
import { forgotPassword } from '../../api/auth';

const ForgotPasswordForm = () => {
  const initialValues = {
    email: ''
  };
  
  const { values, errors, handleChange, validateForm, setErrors } = useForm(
    initialValues,
    validateForgotPasswordForm
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const result = await forgotPassword(values.email);
      
      if (result.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="password-form-section">
      <div className="brand-logo">
        <img src="/assets/images/logo.svg" alt="MyJob" />
        <span>MyJob</span>
      </div>
      
      <div className="password-header">
        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password</p>
      </div>
      
      {submitSuccess ? (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h3>Reset Email Sent</h3>
          <p>We've sent password reset instructions to {values.email}</p>
          <p className="instruction">
            Please check your email and follow the link to reset your password.
            If you don't see the email, check your spam folder.
          </p>
          <div className="action-links">
            <Link to="/login" className="back-to-login">
              Back to Login
            </Link>
            <button 
              type="button" 
              className="resend-link"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Resend Email
            </button>
          </div>
        </div>
      ) : (
        <>
          {submitError && <div className="error-message">{submitError}</div>}
          
          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            
            <button 
              type="submit" 
              className="reset-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Reset Password'}
            </button>
            
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

export default ForgotPasswordForm;