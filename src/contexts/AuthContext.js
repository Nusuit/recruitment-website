// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api"; // Assuming authAPI is exported from src/api/index.js
import axiosInstance from "../api/config/axiosConfig"; // Import for direct header manipulation if needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For initial auth check and critical operations
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"]; // Remove token from future requests
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    const token = localStorage.getItem("token");

    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      try {
        // API call to validate token and fetch user profile
        const response = await authAPI.getCurrentUserProfile(); // Example: GET /api/auth/me
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(response.user)); // Update user in localStorage
        } else {
          throw new Error(
            response.error || "Token validation failed or user not found"
          );
        }
      } catch (error) {
        console.error(
          "Auth status check error (token validation failed):",
          error
        );
        clearAuthData();
        // Optionally set an error message for the user, e.g., "Session expired."
      }
    } else {
      clearAuthData(); // Ensure no lingering auth state if no token
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.login(email, password); // authAPI.login handles localStorage for token & user
      if (result.success && result.user && result.token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.token}`;
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login context error:", error);
      setAuthError(error.message || "Login failed. Please check credentials.");
      clearAuthData(); // Clear any partial auth state
      return { success: false, error: error.message || "Login failed." };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const apiFunction =
        userData.role === "candidate"
          ? authAPI.registerCandidate
          : authAPI.registerRecruiter;
      const result = await apiFunction(userData);
      if (result.success) {
        // After signup, user might need to verify email or could be auto-logged in.
        // If auto-login: handle token and user data similar to login().
        // For now, assume it returns a success message.
        return {
          success: true,
          message: result.message,
          user: result.user /* if returned */,
        };
      } else {
        throw new Error(result.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup context error:", error);
      setAuthError(error.message || "Signup failed. Please try again.");
      return { success: false, error: error.message || "Signup failed." };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      // Optional: Call backend logout endpoint to invalidate session/token on server-side
      // await authAPI.logoutApiCall(); // Assuming authAPI.logoutApiCall() exists
    } catch (error) {
      console.error("API logout error:", error);
      // Proceed with client-side logout even if API call fails
    } finally {
      clearAuthData();
      setLoading(false);
      // Navigation should be handled by the component calling logout, e.g., navigate('/login');
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.forgotPassword(email); // Sends reset link
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        throw new Error(result.error || "Failed to send password reset link.");
      }
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Note: The actual password reset (with token) is typically handled on ResetPasswordPage directly via authAPI.resetPassword

  const loginWithGoogle = () => {
    // Redirects to backend OAuth2 endpoint.
    // Ensure REACT_APP_API_URL is set in your .env file.
    const backendOAuthUrl = `${
      process.env.REACT_APP_API_URL || "http://localhost:8080/api"
    }/oauth2/authorize`; // Adjust endpoint as needed
    const frontendCallbackUrl = `${window.location.origin}/oauth2/callback`;
    const authorizeUrl = `${backendOAuthUrl}?provider=google&redirect_uri=${encodeURIComponent(
      frontendCallbackUrl
    )}`; // Assuming provider query param
    window.location.href = authorizeUrl;
  };

  const handleGoogleOAuthCallback = async (code) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.loginWithGoogleOAuth(code); // Sends code to backend, gets token/user
      if (result.success && result.user && result.token) {
        localStorage.setItem("token", result.token); // Handled by authAPI.loginWithGoogleOAuth if designed so
        localStorage.setItem("user", JSON.stringify(result.user));
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.token}`;
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || "Google OAuth login failed.");
      }
    } catch (error) {
      setAuthError(error.message);
      clearAuthData();
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.verifyOTP(email, otp);
      return result; // { success: true/false, message: ..., error: ... }
    } catch (error) {
      setAuthError(error.message || "OTP verification failed.");
      return {
        success: false,
        error: error.message || "OTP verification failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.resendOTP(email);
      return result;
    } catch (error) {
      setAuthError(error.message || "Failed to resend OTP.");
      return {
        success: false,
        error: error.message || "Failed to resend OTP.",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUserContext = (updatedUserData) => {
    // Called after profile update to refresh context user
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const contextValue = {
    user,
    loading, // Global loading for initial auth check & critical ops
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
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
