// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api"; 
import axiosInstance from "../api/config/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const clearAuthData = () => {
    console.log("[AuthContext] Clearing auth data");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"]; 
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = useCallback(async () => {
    console.log("[AuthContext] Checking auth status...");
    setLoading(true);
    setAuthError(null);
    const token = localStorage.getItem("token");

    if (token) {
      console.log("[AuthContext] Token found, validating...");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      try {
        const response = await authAPI.getCurrentUserProfile(); 
        console.log("[AuthContext] GetCurrentUserProfile response:", response);
        if (response.success && response.user) {
          // LOGIC HARDCODED RECRUITER
          if (response.user.email === "hacnguyet108@gmail.com") { // Kiểm tra email hardcoded
            response.user.role = "RECRUITER"; // Ép vai trò thành RECRUITER
            console.log("[AuthContext] Hardcoded recruiter role applied for:", response.user.email);
          } else {
            response.user.role = "CANDIDATE"; // Tất cả các tài khoản khác là CANDIDATE
          }
          setUser(response.user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(response.user)); 
          console.log("[AuthContext] User authenticated from token:", response.user);
        } else {
          console.warn("[AuthContext] Token validation failed or user not found:", response.error);
          throw new Error(
            response.error || "Token validation failed or user not found"
          );
        }
      } catch (error) {
        console.error(
          "[AuthContext] Auth status check error (token validation failed):",
          error
        );
        clearAuthData();
      }
    } else {
      console.log("[AuthContext] No token found.");
      clearAuthData(); 
    }
    setLoading(false);
    console.log("[AuthContext] Auth status check finished. IsAuthenticated:", isAuthenticated);
  }, []); 

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // SỬA ĐỔI: Hàm login không nhận 'role' từ LoginForm nữa, role được xác định nội bộ
  const login = async (email, password) => { 
    console.log("[AuthContext] Attempting login with:", { email, password });
    setLoading(true);
    setAuthError(null);

    let loginRole = "candidate"; // Mặc định là candidate
    if (email === "hacnguyet108@gmail.com" && password === "123123") {
        loginRole = "recruiter"; // Hardcode recruiter
    }

    try {
        // Nếu là tài khoản recruiter đặc biệt, xử lý riêng với endpoint /admin/login
        if (loginRole === "recruiter" && email === "hacnguyet108@gmail.com") {
            // Gọi hàm xử lý login thành công (nếu backend redirect)
            await handleSpecialLoginSuccess(email); // Hàm này sẽ fetch user profile và set role
            return { success: true, user: user }; // Trả về user sau khi đã set
        } else {
            // Xử lý đăng nhập Candidate hoặc Recruiter thông qua authAPI.login (JSON request)
            const result = await authAPI.login(email, password, loginRole); // Truyền loginRole để authAPI chọn endpoint
            console.log("[AuthContext] Login API result:", result); 
            
            if (result && result.success && result.token) { 
                axiosInstance.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${result.token}`;
                localStorage.setItem("token", result.token); 
                setIsAuthenticated(true); 

                const userProfileResponse = await authAPI.getCurrentUserProfile();
                if (userProfileResponse.success && userProfileResponse.user) {
                    userProfileResponse.user.role = "CANDIDATE"; // Mặc định là CANDIDATE cho các user khác
                    setUser(userProfileResponse.user);
                    localStorage.setItem("user", JSON.stringify(userProfileResponse.user)); 
                    console.log("[AuthContext] User profile fetched and set:", userProfileResponse.user);
                    return { success: true, user: userProfileResponse.user };
                } else {
                    console.warn("[AuthContext] Failed to fetch user profile after login, but token is valid:", userProfileResponse.error);
                    setAuthError(userProfileResponse.error || "Đăng nhập thành công nhưng không lấy được thông tin người dùng.");
                    return { success: true, user: null }; 
                }
            } else {
              const errorMsg = result ? (result.error || "Login failed from API") : "Login API did not return expected structure.";
              console.warn("[AuthContext] Login failed:", errorMsg);
              throw new Error(errorMsg);
            }
        }
    } catch (error) {
      console.error("[AuthContext] Login context error (catch block):", error);
      setAuthError(error.message || "Login failed. Please check credentials.");
      clearAuthData(); 
      return { success: false, error: error.message || "Login failed." };
    } finally {
      setLoading(false);
      console.log("[AuthContext] Login process finished.");
    }
  };

  // SỬA ĐỔI: Đổi tên hàm xử lý login đặc biệt
  const handleSpecialLoginSuccess = async (email) => { // Nhận email để hardcode role
    setLoading(true);
    setAuthError(null);
    try {
      // BƯỚC MỚI: Gọi API để lấy JWT token sau khi form login thành công
      const jwtResponse = await authAPI.getAdminJwtToken(); // Cần tạo hàm này trong authAPI
      if (jwtResponse.success && jwtResponse.token) {
          localStorage.setItem("token", jwtResponse.token);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwtResponse.token}`;
          console.log("[AuthContext] Successfully retrieved JWT after special form login.");

          // Sau khi có JWT, fetch user profile
          const userProfileResponse = await authAPI.getCurrentUserProfile(); 
          if (userProfileResponse.success && userProfileResponse.user) {
              // Ép vai trò thành RECRUITER vì đây là luồng đăng nhập đặc biệt
              userProfileResponse.user.role = "RECRUITER";
              setUser(userProfileResponse.user);
              setIsAuthenticated(true);
              localStorage.setItem("user", JSON.stringify(userProfileResponse.user));
              console.log("[AuthContext] Special login successful. User:", userProfileResponse.user);
              return { success: true, user: userProfileResponse.user };
          } else {
              console.warn("[AuthContext] Failed to fetch profile after special login:", userProfileResponse.error);
              throw new Error(userProfileResponse.error || "Đăng nhập tài khoản đặc biệt thất bại: Không thể lấy thông tin người dùng.");
          }
      } else {
          throw new Error(jwtResponse.error || "Đăng nhập tài khoản đặc biệt thất bại: Không thể lấy JWT token.");
      }
    } catch (error) {
      console.error("[AuthContext] Special login context error (catch block):", error);
      setAuthError(error.message || "Đăng nhập tài khoản đặc biệt thất bại. Vui lòng kiểm tra thông tin.");
      clearAuthData();
      return { success: false, error: error.message || "Đăng nhập tài khoản đặc biệt thất bại." };
    } finally {
      setLoading(false);
    }
  };


  const signup = async (userData) => { 
    console.log("[AuthContext] Attempting signup with userData:", userData);
    setLoading(true); 
    setAuthError(null);
    try {
      // SỬA ĐỔI: Luôn gọi registerCandidate vì không có role dropdown
      const result = await authAPI.registerCandidate(userData); 
      console.log("[AuthContext] Signup API result:", result);
      
      if (result && result.success) { 
        console.log("[AuthContext] Signup successful:", result.message);
        return {
          success: true,
          message: result.message,
          email: result.email, 
        };
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
  };

  const logout = async () => {
    console.log("[AuthContext] Logging out...");
    setLoading(true);
    setAuthError(null);
    try {
      // await authAPI.logoutApiCall(); 
    } catch (error) {
      console.error("[AuthContext] API logout error:", error);
    } finally {
      clearAuthData();
      setLoading(false);
      console.log("[AuthContext] Logout finished.");
    }
  };

  const forgotPassword = async (email) => {
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
  };
  
  const loginWithGoogle = (role = "candidate") => { 
    console.log("[AuthContext] Initiating Google login for role:", role);
    const backendOAuthUrl = `${
      process.env.REACT_APP_API_URL || "http://localhost:8080/api"
    }/oauth2/authorize`; 
    const frontendCallbackUrl = `${window.location.origin}/oauth2/callback`;
    const authorizeUrl = `${backendOAuthUrl}?provider=google&redirect_uri=${encodeURIComponent(
      frontendCallbackUrl
    )}&role=${role}`; 
    window.location.href = authorizeUrl;
  };

  const handleGoogleOAuthCallback = async (code, role = "candidate") => { 
    console.log("[AuthContext] Handling Google OAuth callback with code for role:", role);
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.loginWithGoogleOAuth(code, role); 
      console.log("[AuthContext] Google OAuth API result:", result);
      if (result.success && result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.token}`;
        setUser(result.user);
        setIsAuthenticated(true);
        console.log("[AuthContext] Google OAuth login successful. User:", result.user);
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || "Google OAuth login failed.");
      }
    } catch (error) {
      console.error("[AuthContext] Google OAuth callback error:", error);
      setAuthError(error.message);
      clearAuthData();
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp, role = "candidate") => { 
    console.log("[AuthContext] Verifying OTP for:", { email, otp, role });
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.verifyOTP(email, otp, role); 
      console.log("[AuthContext] Verify OTP API result:", result);
      return result; 
    } catch (error) {
      console.error("[AuthContext] Verify OTP error:", error);
      setAuthError(error.message || "OTP verification failed.");
      return {
        success: false,
        error: error.message || "OTP verification failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email, role = "candidate") => { 
    console.log("[AuthContext] Resending OTP for:", { email, role });
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.resendOTP(email, role); 
      console.log("[AuthContext] Resend OTP API result:", result);
      return result;
    } catch (error) {
      console.error("[AuthContext] Resend OTP error:", error);
      setAuthError(error.message || "Failed to resend OTP.");
      return {
        success: false,
        error: error.message || "Failed to resend OTP.",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUserContext = useCallback((updatedUserData) => { 
    console.log("[AuthContext] Updating user context with:", updatedUserData);
    setUser(prevUser => {
        const newUser = { ...prevUser, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    });
  }, []); 

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
    handleGoogleOAuthCallback,
    verifyOTP,
    resendOTP,
    updateUserContext, 
    checkAuthStatus, 
    handleSpecialLoginSuccess, // SỬA ĐỔI: Đổi tên export
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
