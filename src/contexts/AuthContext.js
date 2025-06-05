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
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("[AuthContext] No token found during profile fetch.");
      clearAuthData();
      return { success: false, error: "No token found." };
    }

    // Đặt Authorization header trước khi gọi API
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const profileResult = await authAPI.getCurrentUserProfile();
      console.log("[AuthContext] GetCurrentUserProfile response:", profileResult);

      if (profileResult.success && profileResult.payload) {
        const rawUserData = profileResult.payload;
        
        const fetchedUser = {
          email: rawUserData.email,
          name: rawUserData.name || rawUserData.email,
          firstName: rawUserData.firstName || rawUserData.name?.split(' ')[0] || rawUserData.email.split('@')[0],
          lastName: rawUserData.lastName || rawUserData.name?.split(' ').slice(1).join(' ') || '',
          address: rawUserData.address,
          avatarUrl: rawUserData.avatarUrl,
          cvUrl: rawUserData.cvUrl,
          dateOfBirth: rawUserData.dateOfBirth,
          gender: rawUserData.gender,
          phone: rawUserData.phone,
          role: rawUserData.role?.toLowerCase(),
          isSuperRecruiter: rawUserData.isSuperRecruiter
        };
        
        if (fetchedUser.email === "hacnguyet108@gmail.com") {
            fetchedUser.role = "recruiter";
            fetchedUser.isSuperRecruiter = true;
        } else if (!fetchedUser.role) {
            fetchedUser.role = "candidate";
        }

        setUser(fetchedUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(fetchedUser));
        console.log("[AuthContext] User profile fetched and set. IsAuthenticated:", true);
        return { success: true, user: fetchedUser }; // TRẢ VỀ user
      } else {
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

  // checkAuthStatus giờ sẽ trả về kết quả của fetchUserProfile
  const checkAuthStatus = useCallback(async () => {
    console.log("[AuthContext] Checking auth status...");
    setLoading(true);
    setAuthError(null);
    const token = localStorage.getItem("token");
    let result;
    if (token) {
      console.log("[AuthContext] Token found, validating...");
      result = await fetchUserProfile(); // Lưu kết quả của fetchUserProfile
    } else {
      console.log("[AuthContext] No token found.");
      clearAuthData();
      result = { success: false, error: "No token found." };
    }
    setLoading(false);
    console.log("[AuthContext] Auth status check finished. IsAuthenticated:", isAuthenticated);
    return result; // TRẢ VỀ KẾT QUẢ CỦA fetchUserProfile
  }, [fetchUserProfile, clearAuthData, isAuthenticated]);

  useEffect(() => {
    // Luôn kiểm tra trạng thái xác thực khi AuthProvider được render
    // hoặc khi có thay đổi liên quan đến trạng thái loading/isAuthenticated
    checkAuthStatus();
  }, [checkAuthStatus]);


  const login = useCallback(async (email, password, role) => {
    console.log("[AuthContext] Attempting login with:", { email, password, role });
    setLoading(true);
    setAuthError(null);

    try {
      const result = await authAPI.login(email, password, role);
      console.log("[AuthContext] Login API result:", result);

      if (result && result.success && result.token) {
        const profileFetchResult = await fetchUserProfile();
        if (profileFetchResult.success) { 
          console.log("[AuthContext] Login successful. User profile fetched.");
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
  }, [clearAuthData, fetchUserProfile]);

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

  const loginWithGoogle = useCallback(() => {
    console.log("[AuthContext] Initiating Google login (Spring Security OAuth2 default URL).");
    const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
    const backendBaseUrl = apiBaseUrl.replace('/api', '');

    const authorizeUrl = `${backendBaseUrl}/oauth2/authorization/google`; 
    
    console.log("[AuthContext] Constructed Google OAuth URL:", authorizeUrl);
    
    window.location.href = authorizeUrl;
  }, []);

  // Đã xóa hàm handleGoogleOAuthCallback khỏi đây.

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

  const updateUserContext = useCallback((updatedUserData) => {
    console.log("[AuthContext] Updating user context with:", updatedUserData);
    setUser(prevUser => {
        const newUser = { ...prevUser, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    });
  }, []);

  const handleSpecialRecruiterLoginSuccess = useCallback(async (email) => {
    console.log("[AuthContext] Handling special recruiter login success for:", email);
    setLoading(true);
    setAuthError(null);
    try {
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
    authError,
    login,
    signup,
    logout,
    forgotPassword,
    loginWithGoogle,
    verifyOTP,
    resendOTP,
    updateUserContext,
    checkAuthStatus, // Export checkAuthStatus để OAuth2CallbackHandler có thể gọi nó
    handleSpecialRecruiterLoginSuccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};