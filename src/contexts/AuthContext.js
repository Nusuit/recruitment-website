// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api"; // Import named export từ index.js
import axiosInstance from "../api/config/axiosConfig"; // Đảm bảo import axiosInstance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null); // Thêm trạng thái lỗi xác thực

  const clearAuthData = useCallback(() => {
    console.log("[AuthContext] Clearing auth data");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null); // Xóa lỗi khi clear data
  }, []);

  // Hàm để lấy thông tin người dùng sau khi đăng nhập hoặc refresh
  const fetchUserProfile = useCallback(async () => {
    console.log("[AuthContext] Fetching user profile...");
    setAuthError(null); // Xóa lỗi trước khi fetch
    const token = localStorage.getLogger("token");
    if (!token) {
      console.log("[AuthContext] No token found during profile fetch.");
      clearAuthData(); // Clear data nếu không có token
      return { success: false, error: "No token found." };
    }

    // Đặt Authorization header trước khi gọi API
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const profileResult = await authAPI.getCurrentUserProfile();
      console.log("[AuthContext] GetCurrentUserProfile response:", profileResult);

      // SỬA ĐỔI QUAN TRỌNG Ở ĐÂY:
      // Kiểm tra nếu profileResult.success là true VÀ có đối tượng payload
      if (profileResult.success && profileResult.payload) {
        const rawUserData = profileResult.payload; // Lấy trực tiếp payload làm dữ liệu user
        
        // Tạo đối tượng fetchedUser với các thuộc tính mong muốn
        const fetchedUser = {
          email: rawUserData.email, // Lấy email từ payload
          name: rawUserData.name || rawUserData.email, // Sử dụng email làm fallback cho name
          firstName: rawUserData.firstName || rawUserData.name || rawUserData.email, // Fallback cho firstName
          lastName: rawUserData.lastName || '', // Fallback cho lastName
          address: rawUserData.address,
          avatarUrl: rawUserData.avatarUrl,
          cvUrl: rawUserData.cvUrl,
          dateOfBirth: rawUserData.dateOfBirth,
          gender: rawUserData.gender,
          phone: rawUserData.phone,
          // Đảm bảo role được đặt đúng cách
          role: rawUserData.role?.toLowerCase(),
          isSuperRecruiter: rawUserData.isSuperRecruiter // Lấy cờ isSuperRecruiter từ payload
        };
        
        // Hardcode vai trò recruiter nếu email khớp, theo logic trước đó của bạn
        if (fetchedUser.email === "hacnguyet108@gmail.com") {
            fetchedUser.role = "recruiter";
            fetchedUser.isSuperRecruiter = true;
        } else if (!fetchedUser.role) { // Mặc định là candidate nếu vai trò chưa được đặt
            fetchedUser.role = "candidate";
        }

        setUser(fetchedUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(fetchedUser)); // Lưu user object vào localStorage
        console.log("[AuthContext] User profile fetched and set. IsAuthenticated:", true);
        return { success: true, user: fetchedUser }; // TRẢ VỀ fetchedUser ĐÃ XỬ LÝ
      } else {
        // Nếu profileResult.success là false hoặc không có payload, coi là lỗi
        console.warn("[AuthContext] Token validation failed or user data missing in payload:", profileResult.message || profileResult.error);
        clearAuthData();
        return { success: false, error: profileResult.message || profileResult.error || "Token validation failed or user data missing." };
      }
    } catch (error) {
      console.error("[AuthContext] Auth status check error (token validation failed):", error);
      clearAuthData();
      return { success: false, error: error.message || "Failed to fetch user profile." };
    }
  }, [clearAuthData]);

  // Effect để kiểm tra trạng thái xác thực khi ứng dụng khởi động
  const checkAuthStatus = useCallback(async () => {
    console.log("[AuthContext] Checking auth status...");
    setLoading(true);
    setAuthError(null); // Xóa lỗi cũ
    const token = localStorage.getLogger("token");
    if (token) {
      console.log("[AuthContext] Token found, validating...");
      await fetchUserProfile(); // Gọi hàm fetchUserProfile để lấy và xác thực profile
    } else {
      console.log("[AuthContext] No token found.");
      clearAuthData();
    }
    setLoading(false); // Kết thúc loading sau khi kiểm tra trạng thái
    console.log("[AuthContext] Auth status check finished. IsAuthenticated:", isAuthenticated);
  }, [fetchUserProfile, clearAuthData, isAuthenticated]); // Thêm isAuthenticated vào dependencies

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);


  const login = useCallback(async (email, password, role) => {
    console.log("[AuthContext] Attempting login with:", { email, password, role });
    setLoading(true);
    setAuthError(null); // Xóa lỗi trước khi login

    try {
      const result = await authAPI.login(email, password, role);
      console.log("[AuthContext] Login API result:", result);

      if (result && result.success && result.token) {
        // Token đã được lưu trong authAPI, giờ chỉ cần fetch user profile
        const profileFetchResult = await fetchUserProfile(); // profileFetchResult sẽ chứa { success: true, user: fetchedUser }
        if (profileFetchResult.success) { 
          console.log("[AuthContext] Login successful. User profile fetched.");
          // SỬA ĐỔI QUAN TRỌNG Ở ĐÂY: Trả về user từ profileFetchResult.user
          return { success: true, user: profileFetchResult.user }; 
        } else {
          console.warn("[AuthContext] Failed to fetch user profile after login, but token is valid:", profileFetchResult.error);
          clearAuthData();
          return { success: false, error: profileFetchResult.error || "Login successful but failed to fetch user profile." };
        }
      } else {
        console.log("[AuthContext] Login failed:", result?.error);
        clearAuthData();
        return { success: false, error: result?.error || "Email or password invalid." };
      }
    } catch (error) {
      console.error("[AuthContext] Login context error (catch block):", error);
      setAuthError(error.message || "Login failed due to an unexpected error.");
      clearAuthData();
      return { success: false, error: error.message || "Login failed due to an unexpected error." };
    } finally {
      setLoading(false);
      console.log("[AuthContext] Login process finished.");
    }
  }, [clearAuthData, fetchUserProfile]); // Đã xóa 'user' khỏi dependencies

  // Hàm đăng ký (signup)
  const signup = useCallback(async (userData) => {
    console.log("[AuthContext] Attempting signup with userData:", userData);
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.registerCandidate(userData);
      console.log("[AuthContext] Signup API result:", result);
      if (result && result.success) {
        console.log("[AuthContext] Signup successful:", result.message);
        return { success: true, message: result.message, email: userData.email };
      } else {
        const errorMsg = result ? (result.error || "Signup failed from API") : "Signup API did not return expected structure.";
        console.warn("[AuthContext] Signup failed:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("[AuthContext] Signup context error (catch block):", error);
      setAuthError(error.message || "Signup failed. Please try again.");
      return { success: false, error: error.message || "Signup failed." };
    } finally {
      setLoading(false);
      console.log("[AuthContext] Signup process finished.");
    }
  }, []);

  // Hàm đăng xuất (logout)
  const logout = useCallback(async () => {
    console.log("[AuthContext] Logging out...");
    setLoading(true);
    setAuthError(null);
    try {
      const currentUserRole = user?.role?.toLowerCase();
      await authAPI.logout(currentUserRole);
    }
    catch (error) {
      console.error("[AuthContext] API logout error:", error);
      setAuthError(error.message || "Logout failed on API side, but local data cleared.");
    } finally {
      clearAuthData();
      setLoading(false);
      console.log("[AuthContext] Logout finished.");
    }
  }, [clearAuthData, user]);

  // Hàm quên mật khẩu (forgotPassword)
  const forgotPassword = useCallback(async (email) => {
    console.log("[AuthContext] Requesting password reset for:", email);
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.forgotPassword(email);
      console.log("[AuthContext] Forgot password API result:", result);
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        throw new Error(result.error || "Failed to send password reset link.");
      }
    } catch (error) {
      console.error("[AuthContext] Forgot password error:", error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // SỬA ĐỔI QUAN TRỌNG: Hàm login với Google OAuth
  const loginWithGoogle = useCallback(() => {
    console.log("[AuthContext] Initiating Google login.");
    const backendOAuthUrl = `${process.env.REACT_APP_API_URL || "http://localhost:8080/api"}/oauth2/authorize`; 
    const frontendCallbackUrl = `${window.location.origin}/oauth2/callback`;
    // Loại bỏ tham số 'role' ở đây, backend sẽ xác định vai trò
    const authorizeUrl = `${backendOAuthUrl}?provider=google&redirect_uri=${encodeURIComponent(frontendCallbackUrl)}`; 
    window.location.href = authorizeUrl;
  }, []);

  // SỬA ĐỔI QUAN TRỌNG: Hàm xử lý OAuth2 callback
  const handleGoogleOAuthCallback = useCallback(async (code) => {
    console.log("[AuthContext] Handling Google OAuth callback with code.");
    setLoading(true);
    setAuthError(null);
    try {
      // GỌI API backend để trao đổi code và nhận token/profile
      // Loại bỏ tham số 'role' ở đây nếu backend không cần nó cho OAuth callback
      const result = await authAPI.loginWithGoogleOAuth(code); 
      console.log("[AuthContext] Google OAuth API result:", result);

      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        // Sau khi nhận token, fetch user profile để cập nhật AuthContext state
        const profileFetchResult = await fetchUserProfile();
        if (profileFetchResult.success) {
          console.log("[AuthContext] Google OAuth login successful. User profile fetched.");
          return { success: true, user: profileFetchResult.user };
        } else {
          console.warn("[AuthContext] Google OAuth login successful, but failed to fetch profile:", profileFetchResult.error);
          clearAuthData();
          return { success: false, error: profileFetchResult.error || "Google OAuth login successful but failed to fetch user profile." };
        }
      } else {
        throw new Error(result.error || "Google OAuth login failed.");
      }
    } catch (error) {
      console.error("[AuthContext] Google OAuth callback error:", error);
      setAuthError(error.message);
      clearAuthData();
      return { success: false, error: error.message || "Google OAuth login failed unexpectedly." };
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, fetchUserProfile]);

  // Hàm xác minh OTP
  const verifyOTP = useCallback(async (email, otp) => {
    console.log("[AuthContext] Verifying OTP for:", { email, otp });
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.verifyOTP(email, otp);
      console.log("[AuthContext] Verify OTP API result:", result);
      return result;
    } catch (error) {
      console.error("[AuthContext] Verify OTP error:", error);
      setAuthError(error.message || "OTP verification failed.");
      return { success: false, error: error.message || "OTP verification failed." };
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm gửi lại OTP
  const resendOTP = useCallback(async (email) => {
    console.log("[AuthContext] Resending OTP for:", { email });
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.resendOTP(email);
      console.log("[AuthContext] Resend OTP API result:", result);
      return result;
    } catch (error) {
      console.error("[AuthContext] Resend OTP error:", error);
      setAuthError(error.message || "Failed to resend OTP.");
      return { success: false, error: error.message || "Failed to resend OTP." };
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm cập nhật thông tin user trong context (ví dụ sau khi update profile)
  const updateUserContext = useCallback((updatedUserData) => {
    console.log("[AuthContext] Updating user context with:", updatedUserData);
    setUser(prevUser => {
        const newUser = { ...prevUser, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    });
  }, []);

  // Hàm xử lý login đặc biệt cho Super Recruiter (nếu cần, có thể không cần thiết nếu logic login chung đã đủ)
  const handleSpecialRecruiterLoginSuccess = useCallback(async (email) => {
    console.log("[AuthContext] Handling special recruiter login success for:", email);
    setLoading(true);
    setAuthError(null);
    try {
      // Sau khi login form thành công, fetch user profile để lấy cờ isSuperRecruiter
      const profileResult = await fetchUserProfile();
      if (profileResult.success) {
        console.log("[AuthContext] Special recruiter login successful. User profile fetched.");
        return { success: true, user: profileResult.user };
      } else {
        console.warn("[AuthContext] Failed to fetch profile after special recruiter login:", profileResult.error);
        clearAuthData();
        return { success: false, error: profileResult.error || "Special recruiter login failed: Could not fetch user profile." };
      }
    } catch (error) {
      console.error("[AuthContext] Special recruiter login context error:", error);
      setAuthError(error.message || "Special recruiter login failed due to an unexpected error.");
      clearAuthData();
      return { success: false, error: error.message || "Special recruiter login failed." };
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, fetchUserProfile]);


  const contextValue = {
    user,
    loading,
    isAuthenticated,
    authError, // Export lỗi xác thực
    login,
    signup,
    logout,
    forgotPassword,
    loginWithGoogle,
    handleGoogleOAuthCallback,
    verifyOTP,
    resendOTP,
    updateUserContext,
    checkAuthStatus, // Export để có thể gọi lại nếu cần
    handleSpecialRecruiterLoginSuccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
