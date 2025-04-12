import axios from './axiosConfig';

export const authAPI = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Đăng ký ứng viên
  registerCandidate: async (candidateData) => {
    try {
      const response = await axios.post('/auth/signup/candidate', candidateData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Đăng ký nhà tuyển dụng 
  registerRecruiter: async (recruiterData) => {
    try {
      const response = await axios.post('/auth/signup/recruiter', recruiterData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Xác thực OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await axios.post('/auth/signup/verify', {
        email,
        otp
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Gửi lại OTP
  resendOTP: async (email) => {
    try {
      const response = await axios.post('/auth/resend-otp', {
        email
      });
      return response.data;
    } catch (error) {
      throw error.response.data; 
    }
  }
};