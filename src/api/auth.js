// src/api/auth.js
import axiosInstance from "./config/axiosConfig"; // Đảm bảo import axiosInstance

// Hàm xử lý phản hồi chung
const handleResponse = (response) => {
  // Kiểm tra nếu response.data tồn tại và có cấu trúc mong muốn
  if (response.data && typeof response.data === 'object') {
    return response.data;
  }
  // Nếu không, trả về một cấu trúc lỗi mặc định
  return { success: false, error: "Unexpected API response format." };
};

// Hàm xử lý lỗi chung
const handleError = (error) => {
  console.error("API call error:", error);
  let errorMessage = "An unexpected error occurred.";
  if (error.response) {
    errorMessage = error.response.data?.message || error.response.data?.error || error.message;
    if (error.response.status === 401) {
      errorMessage = "Unauthorized. Please log in again.";
    } else if (error.response.status === 403) {
      errorMessage = "Access denied.";
    }
  } else if (error.request) {
    errorMessage = "No response from server. Please check your internet connection.";
  } else {
    errorMessage = error.message;
  }
  return { success: false, error: errorMessage };
};

const authAPI = {
  // Đăng nhập chung cho cả applicant và recruiter
  login: async (email, password, role) => {
    console.log("[authAPI] login called with:", { email, password, role });
    let endpoint = "";
    let payload = {};

    if (role === "recruiter") {
      endpoint = "/auth/recruiter/login";
      payload = { email: email, password: password }; // Backend có thể mong đợi 'username' cho recruiter
    } else {
      endpoint = "/auth/applicant/login";
      payload = { email: email, password: password };
    }

    try {
      console.log(`[authAPI] Attempting POST to : ${endpoint} with payload :`, payload);
      const response = await axiosInstance.post(endpoint, payload);
      console.log("[authAPI] Login response from backend:", response);

      // SỬA ĐỔI QUAN TRỌNG Ở ĐÂY:
      // Truy cập đúng cấu trúc phản hồi của backend
      const { success, message, payload: responsePayload } = response.data || {};

      if (success && responsePayload && responsePayload.accessToken) {
        localStorage.setItem("token", responsePayload.accessToken); // Lưu accessToken
        // Lưu user object nếu có trong payload
        if (responsePayload.user) {
          localStorage.setItem("user", JSON.stringify(responsePayload.user));
        }
        return {
          success: true,
          token: responsePayload.accessToken,
          user: responsePayload.user, // Trả về user object từ payload
          isSuperRecruiter: responsePayload.isSuperRecruiter // Lấy cờ isSuperRecruiter
        };
      } else {
        // Nếu success là false, hoặc payload không có accessToken, trả về lỗi
        return {
          success: false,
          error: message || responsePayload?.error || "Đăng nhập thất bại: Không nhận được token hoặc thông tin không hợp lệ.",
        };
      }
    } catch (error) {
      return handleError(error);
    }
  },

  // Đăng ký ứng viên
  registerCandidate: async (userData) => {
    console.log("[authAPI] registerCandidate called with userData:", userData);
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
      };
      console.log("[authAPI] Payload for /auth/applicant/signup:", payload);
      const response = await axiosInstance.post(
        "/auth/applicant/signup",
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

  getAdminJwtToken: async () => {
    console.log("[authAPI] getAdminJwtToken called");
    try {
        const response = await axiosInstance.get('/auth/recruiter/get-jwt');
        console.log("[authAPI] getAdminJwtToken response:", response);
        if (response.data?.success && response.data?.payload?.accessToken) {
            return {
                success: true,
                token: response.data.payload.accessToken,
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

  verifyOTP: async (email, otp) => {
    console.log("[authAPI] verifyOTP called with:", { email, otp });
    try {
      let verifyUrl = "/auth/applicant/signup/verify";
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

  resendOTP: async (email) => {
    console.log("[authAPI] resendOTP called for:", { email });
    try {
      let resendUrl = "/auth/applicant/signup/resend-otp";
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

  loginWithGoogleOAuth: async (code) => {
    console.log("[authAPI] loginWithGoogleOAuth called with code");
    try {
      let oauthUrl = `/auth/applicant/login/oauth2?code=${code}`;
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

  logout: async (role) => {
    console.log("[authAPI] Logging out for role:", role);
    try {
      let logoutUrl = "";
      if (role === "applicant") {
        logoutUrl = "/auth/applicant/logout";
      } else if (role === "recruiter") {
        logoutUrl = "/auth/recruiter/logout";
      } else {
        console.warn("[authAPI] Unknown role for logout, clearing local data only.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axiosInstance.defaults.headers.common["Authorization"];
        return { success: true };
      }
      const response = await axiosInstance.post(logoutUrl);
      console.log("[authAPI] Logout API response:", response);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axiosInstance.defaults.headers.common["Authorization"];
      return { success: true, message: response.data?.message };
    } catch (error) {
      console.error("[authAPI] Logout API error:", error.response || error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axiosInstance.defaults.headers.common["Authorization"];
      return { success: false, error: error.response?.data?.message || error.message };
    }
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

  // THÊM LẠI HÀM getCurrentUserProfile VÀO ĐÂY
  getCurrentUserProfile: async () => {
    console.log("[authAPI] getCurrentUserProfile called");
    try {
      const response = await axiosInstance.get("/auth/me"); // Endpoint để lấy profile
      console.log("[authAPI] getCurrentUserProfile response from backend (raw):", response);
      // Backend nên trả về { success: true, user: {...}, ... }
      if (response.data) {
        return response.data;
      }
      return { success: false, error: "Empty response data from /auth/me" };
    } catch (error) {
      return handleError(error);
    }
  },
};

export default authAPI;
