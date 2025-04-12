import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authAPI from '../../api/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      const { user } = response;

      // Redirect dựa vào role
      const redirect = location.state?.from || 
        (user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
      navigate(redirect, { replace: true });
      
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="brand-logo">
            <img src="/assets/images/logo.png" alt="MyJob" />
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
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
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
              
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="social-login">
              <p>Or sign in with</p>
              <div className="social-buttons">
                <button type="button" className="google-login">
                  <img src="/assets/icons/google.svg" alt="Google" />
                  Sign in with Google
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="login-image">
          <img src="/assets/images/login.png" alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;