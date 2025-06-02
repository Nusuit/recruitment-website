import axios from './axiosConfig';

export const authAPI = {
  // Đăng nhập
  // Gợi ý sửa trong authAPI.js (phiên bản auth_api_v6 trên Canvas)
login: async (email, password, role) => {
  console.log("[authAPI] login called with:", { email, role });
  try {
    let loginUrl = "";
    if (role === "candidate") {
      loginUrl = "/auth/candidate/login";
    } else if (role === "recruiter") {
      loginUrl = "/auth/recruiter/login";
    } else {
      console.error("[authAPI] Invalid role for login:", role);
      return {
        success: false,
        error: "Vai trò người dùng không hợp lệ để đăng nhập.",
      };
    }
    console.log("[authAPI] Attempting POST to:", loginUrl);
    const response = await axiosInstance.post(loginUrl, { // axiosInstance được import từ ./config/axiosConfig
      email,
      password,
    });
    console.log("[authAPI] Login response from backend:", response);

    // KIỂM TRA KỸ response.data TRƯỚC KHI TRUY CẬP
    if (response && response.data) {
      const { data, success, message } = response.data;
      if (success && data && data.token && data.user) { // Đảm bảo data, data.token và data.user tồn tại
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          error: message || data?.error || "Đăng nhập thất bại từ API.", // Lấy lỗi từ message hoặc data.error
        };
      }
    } else {
      // Trường hợp response hoặc response.data không tồn tại
      return {
        success: false,
        error: "Phản hồi không hợp lệ từ server.",
      };
    }
  } catch (error) {
    console.error("[authAPI] Login error (catch block):", error.response || error);
    return {
      success: false,
      error:
        error.response?.data?.message || // Ưu tiên message từ response.data
        error.response?.data?.error ||   // Sau đó là error từ response.data
        error.message ||                 // Sau đó là error.message (lỗi mạng, etc.)
        "Đã xảy ra lỗi trong quá trình đăng nhập.",
    };
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