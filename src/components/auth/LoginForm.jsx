import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validators';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  const { values, errors, handleChange, validateForm, setErrors } = useForm(
    initialValues,
    validateLoginForm
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        // Redirect back to the page they were trying to access, or to dashboard
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/applicant/dashboard');
        }
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="login-form-section">
      <div className="brand-logo">
        <img src="/assets/images/logo.png" alt="MyJob" />
        <span>MyJob</span>
      </div>
      
      <div className="login-header">
        <h2>Log In</h2>
        <p>Don't have account? <Link to="/signup">Create Account</Link></p>
      </div>
      
      {submitError && <div className="error-message">{submitError}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
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
        </div>
        
        <div className="form-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={values.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
        
        <div className="social-login">
          <p>or sign in with</p>
          <div className="social-buttons">
            <button type="button" className="facebook-login">
              <span className="facebook-icon">f</span>
              Sign in with Facebook
            </button>
            <button type="button" className="google-login">
              <span className="google-icon">G</span>
              Sign in with Google
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;