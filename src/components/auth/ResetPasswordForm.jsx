import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { validateResetPasswordForm } from '../../utils/validators';
import { resetPassword } from '../../api/auth';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const initialValues = {
    password: '',
    confirmPassword: ''
  };
  
  const { values, errors, handleChange, validateForm, setErrors } = useForm(
    initialValues,
    validateResetPasswordForm
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Check if token is present
  const isTokenMissing = !token;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isTokenMissing) {
      setSubmitError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const result = await resetPassword(token, values.password);
      
      if (result.success) {
        // Redirect to login page with success message
        navigate('/login', { 
          state: { 
            success: true, 
            message: 'Your password has been reset successfully. You can now log in with your new password.'
          }
        });
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="password-form-section">
      <div className="brand-logo">
        <img src="/assets/images/logo.png" alt="MyJob" />
        <span>MyJob</span>
      </div>
      
      <div className="password-header">
        <h2>Reset Password</h2>
        <p>Enter your new password below</p>
      </div>
      
      {isTokenMissing ? (
        <div className="error-container">
          <div className="error-icon">!</div>
          <h3>Invalid Reset Link</h3>
          <p>The password reset link is invalid or has expired.</p>
          <div className="action-links">
            <Link to="/forgot-password" className="request-new-link">
              Request New Reset Link
            </Link>
            <Link to="/login" className="back-to-login">
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <>
          {submitError && <div className="error-message">{submitError}</div>}
          
          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <div className="password-input">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <button type="button" className="toggle-password">
                  <span className="eye-icon">👁️</span>
                </button>
              </div>
              {errors.password && <div className="field-error">{errors.password}</div>}
              <div className="password-hint">
                Password must be at least 8 characters and include letters and numbers
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-input">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <button type="button" className="toggle-password">
                  <span className="eye-icon">👁️</span>
                </button>
              </div>
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>
            
            <button 
              type="submit" 
              className="reset-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordForm;