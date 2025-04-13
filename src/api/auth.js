import axiosInstance from './config/axiosConfig';

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      // Kiểm tra và lấy data từ ApiResponse format
      const { data, success, message } = response.data;

      if (success) {
        // Lưu token và user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      } else {
        return {
          success: false,
          error: message || 'Login failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during login'
      };
    }
  },

  registerCandidate: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signup/candidate', userData);
      // Đảm bảo API trả về verificationUrl hoặc token
      return {
        success: true,
        verificationUrl: response.data.verificationUrl,
        // hoặc token: response.data.token
        email: userData.email
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
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
      const response = await axiosInstance.post('/auth/resend-otp', {
        email: email
      });
      
      // Match với response format từ backend API
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Resend OTP successful'
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Failed to resend OTP'
        };
      }
    } catch (error) {
      // Xử lý lỗi từ API và trả về format phù hợp
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to resend verification code'
      };
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

export const verifyEmail = async (otp, email) => {
  try {
    const response = await axiosInstance.post('/auth/verify-email', {
      otp,
      email
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Verification failed'
    };
  }
};

export default authAPI;