import axiosInstance from './config/axiosConfig';

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  registerCandidate: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signup/candidate', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  registerRecruiter: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signup/recruiter', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/auth/signup/verify', {
        email,
        otp
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('token', token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Function to check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Function to get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authAPI;