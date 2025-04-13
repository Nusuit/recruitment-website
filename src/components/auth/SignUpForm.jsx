import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import { validateSignupForm } from '../../utils/validators';
import authAPI from '../../api/auth';
import '../../styles/AuthForms.css';

const SignUpForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
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

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const userData = {
        email: values.email,
        password: values.password,
        role: values.role
      };

      const result = values.role === 'candidate'
        ? await authAPI.registerCandidate(userData)
        : await authAPI.registerRecruiter(userData);

      if (result.success) {
        navigate('/check-email', {
          state: {
            email: values.email,
            message: 'Please check your email to verify your account'
          }
        });
      } else {
        setSubmitError(result.error || 'Registration failed');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="signup-form-section">
      <div className="form-container">
        <div className="brand-logo">
          <img src="/assets/images/logo.png" alt="MyJob" />
          <span>MyJob</span>
        </div>
        
        <div className="signup-header">
          <div>
            <h2>Create Account</h2>
            <p>Already have an account? <Link to="/login">Log In</Link></p>
          </div>
          
          <div className="role-select">
            <select
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              required
            >
              <option value="candidate">Find a Job</option>
              <option value="recruiter">Post Jobs</option>
            </select>
          </div>
        </div>
        
        {submitError && <div className="error-message">{submitError}</div>}
        
        <form onSubmit={handleSubmit} className="signup-form">         
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
          
          <div className="social-login">
            <p>or sign up with</p>
            <div className="social-buttons">
              <button type="button" className="facebook-login">
                <img src="assets/images/facebook.png" alt="Facebook" />
                Sign up with Facebook
              </button>
              <button type="button" className="google-login">
                <img src="assets/images/google.png" alt="Google" />
                Sign up with Google
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="image-container">
        <img src="/assets/images/register.png" alt="Register illustration" />
      </div>
    </div>
  );
};

export default SignUpForm;