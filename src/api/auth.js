// src/api/auth.js
import axiosInstance from "./config/axiosConfig";

export const authAPI = {
  login: async (email, password, role) => { // Giữ role để chọn endpoint
    console.log("[authAPI] login called with:", { email, password, role }); 
    try {
      let loginUrl = ""; 
      // THAY ĐỔI: Chỉ có 2 endpoint chính cho login (candidate và recruiter)
      // Endpoint admin sẽ được xử lý riêng trong LoginForm
      if (role === "candidate") {
        loginUrl = "/auth/candidate/login"; 
      } else if (role === "recruiter") { // Đây là recruiter bình thường (không phải hardcoded admin)
        loginUrl = "/auth/recruiter/login"; 
      } else {
        console.error("[authAPI] Invalid role for login:", role);
        return {
          success: false,
          error: "Vai trò người dùng không hợp lệ để đăng nhập.",
        };
      }
      console.log("[authAPI] Attempting POST to:", loginUrl);
      const response = await axiosInstance.post(loginUrl, {
        username: email, 
        password,
      });
      console.log("[authAPI] Login response from backend:", response);

      const { data, success, message } = response.data || {}; 

      if (success && data && data.accessToken) { 
        localStorage.setItem("token", data.accessToken); 
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        console.log("[authAPI] Login successful. AccessToken stored.");
        return {
          success: true,
          user: undefined, 
          token: data.accessToken,
        };
      } else {
        return {
          success: false,
          error: message || data?.error || "Đăng nhập thất bại: Thông tin đăng nhập không hợp lệ.",
        };
      }
    } catch (error) {
      console.error("[authAPI] Login error (catch block):", error.response || error);
      if (error.response) {
          console.error("Backend Error Details:", error.response.data);
          console.error("Backend Error Status:", error.response.status);
      }
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||   
          error.message ||                 
          "Đã xảy ra lỗi trong quá trình đăng nhập.",
      };
    }
  },

  // SỬA ĐỔI: registerCandidate không còn nhận role, luôn là candidate
  registerCandidate: async (userData) => { 
    console.log("[authAPI] registerCandidate called with userData:", userData);
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
      };
      console.log("[authAPI] Payload for /auth/candidate/signup:", payload);
      const response = await axiosInstance.post(
        "/auth/candidate/signup", 
        payload
      );
      console.log("[authAPI] registerCandidate response from backend:", response);
      
      if (response.data && (response.data.success !== undefined ? response.data.success : true)) {
        return {
          success: true,
          message: response.data.message || "Đăng ký ứng viên thành công! Vui lòng kiểm tra email để xác thực.",
          email: userData.email, 
        };
      } else {
        return {
          success: false,
          error: response.data?.message || "Đăng ký ứng viên thất bại từ API",
        };
      }
    } catch (error) {
      console.error("[authAPI] registerCandidate error (catch block):", error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Đăng ký ứng viên thất bại",
      };
    }
  },

  // BỎ: registerRecruiter không còn được gọi từ SignUpForm
  /*
  registerRecruiter: async (userData) => {
    console.log("[authAPI] registerRecruiter called with userData:", userData);
    try {
      const payload = {
        username: userData.email, 
        password: userData.password,
        firstName: userData.firstName, 
        lastName: userData.lastName,   
      };
      console.log("[authAPI] Payload for /auth/recruiter/signup:", payload);
      const response = await axiosInstance.post(
        "/auth/recruiter/signup", 
        payload 
      );
      console.log("[authAPI] registerRecruiter response from backend:", response);

      if (response.data && (response.data.success !== undefined ? response.data.success : true)) {
        return {
          success: true,
          message: response.data.message || "Đăng ký nhà tuyển dụng thành công!",
        };
      } else {
        return {
          success: false,
          error: response.data?.message || "Đăng ký nhà tuyển dụng thất bại từ API",
        };
      }
    } catch (error) {
      console.error("[authAPI] registerRecruiter error (catch block):", error.response || error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Đăng ký nhà tuyển dụng thất bại",
      };
    }
  },
  */

  // THÊM: Hàm mới để lấy JWT token sau khi admin form login thành công
  getAdminJwtToken: async () => {
    console.log("[authAPI] getAdminJwtToken called");
    try {
        const response = await axiosInstance.get('/api/auth/admin/get-jwt'); // Endpoint mới ở backend
        console.log("[authAPI] getAdminJwtToken response:", response);
        if (response.data?.success && response.data?.data?.accessToken) {
            return {
                success: true,
                token: response.data.data.accessToken,
            };
        }
        return {
            success: false,
            error: response.data?.message || "Failed to get JWT token from admin session."
        };
    } catch (error) {
        console.error("[authAPI] getAdminJwtToken error:", error.response || error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Failed to get JWT token."
        };
    }
  },

  verifyOTP: async (email, otp, role = "candidate") => { 
    console.log("[authAPI] verifyOTP called with:", { email, otp, role });
    try {
      let verifyUrl = "/auth/candidate/signup/verify"; 
      console.log("[authAPI] Attempting POST to:", verifyUrl);
      const response = await axiosInstance.post(verifyUrl, { email, otp });
      console.log("[authAPI] verifyOTP response from backend:", response);

      if (response.data && (response.data.success !== undefined ? response.data.success : true)) {
        return {
          success: true,
          message: response.data.message || "Xác thực OTP thành công",
        };
      } else {
        return {
          success: false,
          error: response.data?.message || "Xác thực OTP thất bại từ API",
        };
      }
    } catch (error) {
      console.error("[authAPI] verifyOTP error (catch block):", error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Xác thực OTP thất bại",
      };
    }
  },

  resendOTP: async (email, role = "candidate") => { 
    console.log("[authAPI] resendOTP called for:", { email, role });
    try {
      let resendUrl = "/auth/candidate/resend-otp"; 
      console.log("[authAPI] Attempting POST to:", resendUrl);
      const response = await axiosInstance.post(resendUrl, { email });
      console.log("[authAPI] resendOTP response from backend:", response);

      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || "Gửi lại OTP thành công",
        };
      } else {
        return {
          success: false,
          error: response.data?.message || "Gửi lại OTP thất bại",
        };
      }
    } catch (error) {
      console.error("[authAPI] resendOTP error (catch block):", error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Không thể gửi lại mã xác minh",
      };
    }
  },

  forgotPassword: async (email) => {
    console.log("[authAPI] forgotPassword called for:", email);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      console.log("[authAPI] forgotPassword response:", response);
      return {
        success: true,
        message: response.data.message || "Email đặt lại mật khẩu đã được gửi",
      };
    } catch (error) {
      console.error("[authAPI] forgotPassword error:", error.response || error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Yêu cầu đặt lại mật khẩu thất bại",
      };
    }
  },

  resetPassword: async (token, newPassword) => {
    console.log("[authAPI] resetPassword called with token (first 5 chars):", token ? token.substring(0,5) : "NO_TOKEN");
    try {
      const response = await axiosInstance.post("/auth/reset-password", { token, newPassword });
      console.log("[authAPI] resetPassword response:", response);
      return {
        success: true,
        message: response.data.message || "Mật khẩu đã được đặt lại thành công",
      };
    } catch (error) {
      console.error("[authAPI] resetPassword error:", error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Đặt lại mật khẩu thất bại",
      };
    }
  },

  loginWithGoogleOAuth: async (code, role = "candidate") => { 
    console.log("[authAPI] loginWithGoogleOAuth called with code for role:", role);
    try {
      let oauthUrl = `/auth/candidate/login/oauth2?code=${code}`; 
      console.log("[authAPI] Attempting GET to:", oauthUrl);
      const response = await axiosInstance.get(oauthUrl); 
      console.log("[authAPI] loginWithGoogleOAuth response from backend:", response);
      
      const { data, success, message } = response.data || {};

      if (success) {
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
          error: message || "Đăng nhập Google OAuth thất bại",
        };
      }
    } catch (error) {
      console.error("[authAPI] loginWithGoogleOAuth error (catch block):", error.response || error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message ||
          "Đã xảy ra lỗi trong quá trình đăng nhập Google OAuth",
      };
    }
  },

  logout: () => {
    console.log("[authAPI] Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  getCurrentUser: () => {
    const userString = localStorage.getItem("user");
    try {
        return userString ? JSON.parse(userString) : null;
    } catch (e) {
        console.error("[authAPI] Error parsing user from localStorage", e);
        return null;
    }
  },

  getCurrentUserProfile: async () => {
    console.log("[authAPI] getCurrentUserProfile called");
    try {
        const response = await axiosInstance.get('/auth/me'); 
        console.log("[authAPI] getCurrentUserProfile response from backend:", response);
        // Giả sử backend trả về { success: true, data: { user: {...} } } hoặc { success: true, user: {...} }
        const user = response.data?.data?.user || response.data?.user;
        if (response.data?.success && user) {
            return {
                success: true,
                user: user, 
            };
        }
        return {
            success: false,
            error: response.data?.message || "User data not found in profile response"
        };
    } catch (error) {
        console.error("[authAPI] getCurrentUserProfile error:", error.response || error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Failed to fetch user profile",
        };
    }
  },
};

export default authAPI;
