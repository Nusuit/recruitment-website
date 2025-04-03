import axios from 'axios';

// Create axios instance for auth API
const authAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
authAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle response errors
authAPI.interceptors.response.use(
  response => response,
  error => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page, but avoid infinite loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Login user
export const login = async (email, password) => {
  try {
    const response = await authAPI.post('/auth/login', {
      email,
      password
    });
    
    // Store token and user data
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    
    const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
    return { success: false, error: errorMessage };
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await authAPI.post('/auth/register', userData);
    
    // Store token and user data if auto-login
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    console.error('Registration error:', error);
    
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    return { success: false, error: errorMessage };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return { success: true };
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await authAPI.post('/auth/forgot-password', { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Forgot password error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to process forgot password request.';
    return { success: false, error: errorMessage };
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await authAPI.post('/auth/reset-password', {
      token,
      password
    });
    
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Reset password error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to reset password.';
    return { success: false, error: errorMessage };
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await authAPI.post('/auth/verify-email', { token });
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Email verification error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to verify email.';
    return { success: false, error: errorMessage };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await authAPI.get('/auth/me');
    return { success: true, user: response.data.user };
  } catch (error) {
    console.error('Get current user error:', error);
    
    // Not returning error as failure since this might be called on app init
    return { success: false };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await authAPI.put('/auth/profile', userData);
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return { success: true, user: response.data.user };
  } catch (error) {
    console.error('Update profile error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to update profile.';
    return { success: false, error: errorMessage };
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await authAPI.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Change password error:', error);
    
    const errorMessage = error.response?.data?.message || 'Failed to change password.';
    return { success: false, error: errorMessage };
  }
};

export default {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getCurrentUser,
  updateProfile,
  changePassword
};