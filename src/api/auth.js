import axiosInstance from "./config/axiosConfig";

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { data, success, message } = response.data;

      if (success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          error: message || "Đăng nhập thất bại",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình đăng nhập",
      };
    }
  },

  registerCandidate: async (userData) => {
    try {
      const response = await axiosInstance.post(
        "/auth/signup/candidate",
        userData
      );
      return {
        success: true,
        message: response.data.message || "Đăng ký ứng viên thành công",
        email: userData.email,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Đăng ký ứng viên thất bại",
      };
    }
  },

  registerRecruiter: async (userData) => {
    try {
      const response = await axiosInstance.post(
        "/auth/signup/recruiter",
        userData
      );
      return {
        success: true,
        message: response.data.message || "Đăng ký nhà tuyển dụng thành công",
        email: userData.email,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Đăng ký nhà tuyển dụng thất bại",
      };
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await axiosInstance.post("/auth/signup/verify", {
        email,
        otp,
      });
      return {
        success: true,
        message: response.data.message || "Xác thực OTP thành công",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Xác thực OTP thất bại",
      };
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/resend-otp", {
        email: email,
      });
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || "Gửi lại OTP thành công",
        };
      } else {
        return {
          success: false,
          error: response.data.message || "Gửi lại OTP thất bại",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Không thể gửi lại mã xác minh",
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return {
        success: true,
        message: response.data.message || "Email đặt lại mật khẩu đã được gửi",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Yêu cầu đặt lại mật khẩu thất bại",
      };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return {
        success: true,
        message: response.data.message || "Mật khẩu đã được đặt lại thành công",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Đặt lại mật khẩu thất bại",
      };
    }
  },

  // New OAuth2 related API call
  loginWithGoogleOAuth: async (code) => {
    try {
      const response = await axiosInstance.get(
        `/auth/candidate/login/oauth2?code=${code}`
      );
      const { data, success, message } = response.data;

      if (success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          error: message || "Đăng nhập Google OAuth thất bại",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình đăng nhập Google OAuth",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally, call a backend logout endpoint if needed
    // axiosInstance.post('/auth/logout');
    window.location.href = "/login"; // Redirect to login page
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authAPI;
