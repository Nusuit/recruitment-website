import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { success, error, user } = await login(formData.email, formData.password);
      
      if (success) {
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/applicant/dashboard');
        }
      } else {
        setError(error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="brand-logo">
            <img src="/assets/images/logo.svg" alt="MyJob" />
            <span>MyJob</span>
          </div>
          
          <div className="login-header">
            <h2>Log In</h2>
            <p>Don't have account? <Link to="/signup">Create Account</Link></p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <button type="button" className="toggle-password">
                  <span className="eye-icon">👁️</span>
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
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
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
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
        
        <div className="login-image-section">
          <div className="quote">
            <p>"Style is a way to say who you are without having to speak."</p>
            <cite>- Rachel Zoe</cite>
          </div>
          <img 
            src="/assets/images/illustrations/fashion-models.png" 
            alt="Fashion models illustration" 
            className="fashion-illustration"
          />
          <img src="/assets/images/login.png" alt="Login Illustration" className="login-image" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;