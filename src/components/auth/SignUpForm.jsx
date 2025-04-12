import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import { validateSignupForm } from '../../utils/validators';

const SignUpForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };
  
  const { values, errors, handleChange, validateForm, setErrors } = useForm(
    initialValues,
    validateSignupForm
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!values.agreeTerms) {
      setErrors({
        ...errors,
        agreeTerms: 'You must agree to the Terms of Service and Privacy Policy'
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password
      };
      
      const result = await register(userData);
      
      if (result.success) {
        // Redirect to dashboard or verification page
        navigate('/applicant/dashboard');
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="signup-form-section">
      <div className="brand-logo">
        <img src="/assets/images/logo.png" alt="MyJob" />
        <span>MyJob</span>
      </div>
      
      <div className="signup-header">
        <h2>Create Account</h2>
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
      
      {submitError && <div className="error-message">{submitError}</div>}
      
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-row">
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
        </div>
        
        <div className="form-row">
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
            <div className="password-hint">
              Password must be at least 8 characters and include letters and numbers
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
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
        </div>
        
        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={values.agreeTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agreeTerms">
              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
            </label>
          </div>
          {errors.agreeTerms && <div className="field-error">{errors.agreeTerms}</div>}
        </div>
        
        <button 
          type="submit" 
          className="signup-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="social-signup">
          <p>or sign up with</p>
          <div className="social-buttons">
            <button type="button" className="facebook-signup">
              <span className="facebook-icon">f</span>
              Sign up with Facebook
            </button>
            <button type="button" className="google-signup">
              <span className="google-icon">G</span>
              Sign up with Google
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;