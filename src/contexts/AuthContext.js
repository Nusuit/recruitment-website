// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { authAPI } from "../api";
import axiosInstance from "../api/config/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isInitialCheckDone = useRef(false); 

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  }, []);

  const extractNameFromEmail = (email) => {
    if (!email) return '';
    const emailName = email.split('@')[0];
    
    // Handle different email formats
    if (emailName.includes('.')) {
      const [firstName] = emailName.split('.');
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    } else if (emailName.includes('_')) {
      const [firstName] = emailName.split('_');
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    } else if (emailName.match(/[A-Z]/)) {
      // For "firstLast@domain.com" format
      const firstName = emailName.match(/^[a-z]+|[A-Z][a-z]*/)[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    
    // Enhanced Vietnamese name handling
    
    // Default case - just capitalize the first part
    const possibleName = emailName.match(/^[a-z]+|[0-9]+/i)[0];
    return possibleName.charAt(0).toUpperCase() + possibleName.slice(1).toLowerCase();
  };

  const fetchUserProfile = useCallback(async () => {
    setAuthError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      clearAuthData();
      return { success: false, error: "No token found." };
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const profileResult = await authAPI.getCurrentUserProfile();

      if (profileResult.success && profileResult.payload) {
        const rawUserData = profileResult.payload;
        let fetchedUser;

        // Handle recruiter profile response structure
        const userData = rawUserData.user || rawUserData;
        const isSuperRecruiter = rawUserData.isSuperRecruiter || false;

        // Special recruiter email check - must be done first
        if (userData?.email?.toLowerCase() === "hacnguyet108@gmail.com") {
          fetchedUser = {
            email: userData.email,
            name: userData.name || 'Nguyet',
            firstName: userData.firstName || 'Nguyet',
            lastName: userData.lastName || '',
            role: 'recruiter',
            isAdmin: true,
            isSuperRecruiter: true,
            avatarUrl: userData.avatarUrl || ''
          };
        } else {
          // Regular user handling
          fetchedUser = {
            email: userData?.email || '',
            name: userData?.name || '',
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            address: userData?.address || '',
            avatarUrl: userData?.avatarUrl || '',
            cvUrl: userData?.cvUrl || '',
            dateOfBirth: userData?.dateOfBirth || null,
            gender: userData?.gender || '',
            phone: userData?.phone || '',
            role: (userData?.role || 'applicant').toLowerCase(),
            isSuperRecruiter: isSuperRecruiter
          };

          // Extract firstName if not provided or empty
          if (!fetchedUser.firstName || fetchedUser.firstName.trim() === '') {
            if (fetchedUser.email) {
              fetchedUser.firstName = extractNameFromEmail(fetchedUser.email);
            }
          }

          // Process full name if available
          if ((!fetchedUser.firstName || fetchedUser.firstName.trim() === '') && userData?.name) {
            const nameParts = userData.name.split(' ').filter(part => part);
            if (nameParts.length > 0) {
              fetchedUser.firstName = nameParts[0];
              if (nameParts.length > 1) {
                fetchedUser.lastName = nameParts.slice(1).join(' ');
              }
            }
          }

          // Set name if still empty
          if (!fetchedUser.name || fetchedUser.name.trim() === '') {
            fetchedUser.name = fetchedUser.firstName + (fetchedUser.lastName ? ' ' + fetchedUser.lastName : '');
          }

          // Default role if none set
          if (!fetchedUser.role) {
            fetchedUser.role = 'applicant';
          }
        }

        // Update state and storage only if email is valid
        if (fetchedUser.email && fetchedUser.email.trim() !== '') {
          setUser(fetchedUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          return { success: true, user: fetchedUser };
        } else {
          // If no email, treat as guest
          clearAuthData();
          return { success: false, error: 'User profile missing email.' };
        }
      } else {
        clearAuthData();
        return { 
          success: false, 
          error: profileResult.message || "Token validation failed or user data missing.",
          details: "Expected user profile data in response payload"
        };
      }
    } catch (error) {
      clearAuthData();
      return { 
        success: false, 
        error: error.message || "Failed to fetch user profile.",
        details: "Error occurred while fetching user profile from backend"
      };
    }
  }, [clearAuthData]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        clearAuthData();
        return false;
      }

      // Validate token and refresh user data
      const profileResult = await fetchUserProfile();
      
      if (!profileResult.success) {
        clearAuthData();
        return false;
      }

      setUser(profileResult.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("[AuthContext] Auth status check failed:", error);
      clearAuthData();
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, fetchUserProfile]);

  // Initialize auth state
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (email, password, role) => {
    setLoading(true);
    setAuthError(null);

    try {
      const result = await authAPI.login(email, password, role);

      if (result && result.success && result.token) {
        const profileFetchResult = await fetchUserProfile();
        if (profileFetchResult.success) { 
          return { success: true, user: profileFetchResult.user }; 
        } else {
          console.warn("[AuthContext] Failed to fetch user profile after credential login, but token seems valid:", profileFetchResult.error);
          clearAuthData();
          return { success: false, error: profileFetchResult.error || "Login successful but failed to fetch user profile." };
        }
      } else {
        console.log("[AuthContext] Login failed via credentials. Error:", result?.error);
        clearAuthData();
        return { success: false, error: result?.error || "Email or password invalid." };
      }
    } catch (error) {
      console.error("[AuthContext] Login context error (credentials):", error.response?.status, error.message);
      setAuthError(error.message || "Login failed due to an unexpected error.");
      clearAuthData();
      return { success: false, error: error.message || "Login failed due to an unexpected error." };
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, fetchUserProfile]);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.registerCandidate(userData);
      if (result && result.success) {
        return { success: true, message: result.message, email: userData.email };
      } else {
        const errorMsg = result ? (result.error || "Signup failed from API") : "Signup API did not return expected structure.";
        console.warn("[AuthContext] Signup failed:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("[AuthContext] Signup context error (catch block):", error.response || error);
      setAuthError(error.message || "Signup failed. Please try again.");
      return { success: false, error: error.message || "Signup failed." };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const currentUserRole = user?.role?.toLowerCase();
      await authAPI.logout(currentUserRole);
    }
    catch (error) {
      console.error("[AuthContext] API logout error:", error.response || error);
      setAuthError(error.message || "Logout failed on API side, but local data cleared.");
    } finally {
      clearAuthData();
      setLoading(false);
    }
  }, [clearAuthData, user]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.forgotPassword(email);
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        throw new Error(result.error || "Failed to send password reset link.");
      }
    } catch (error) {
      console.error("[AuthContext] Forgot password error:", error.response || error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
    const backendBaseUrl = apiBaseUrl.replace('/api', '');

    const authorizeUrl = `${backendBaseUrl}/oauth2/authorization/google`; 
    
    window.location.href = authorizeUrl;
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.verifyOTP(email, otp);
      return result;
    } catch (error) {
      console.error("[AuthContext] Verify OTP error:", error.response || error);
      setAuthError(error.message || "OTP verification failed.");
      return { success: false, error: error.message || "OTP verification failed." };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendOTP = useCallback(async (email) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.resendOTP(email);
      return result;
    } catch (error) {
      console.error("[AuthContext] Resend OTP error:", error.response || error);
      setAuthError(error.message || "Failed to resend OTP.");
      return { success: false, error: error.message || "Failed to resend OTP." };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserContext = useCallback((updatedUserData) => {
    setUser(prevUser => {
        const newUser = { ...prevUser, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    });
  }, []);

  const handleGoogleOAuthCallback = useCallback(async (token) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      // Clear any existing auth data
      clearAuthData();
      
      // Set up axios with the new token
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);

      // Fetch user profile first
      const profileResult = await fetchUserProfile();
      
      if (!profileResult.success || !profileResult.user) {
        throw new Error(profileResult.error || "Failed to fetch user profile");
      }

      const userData = profileResult.user;
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error("[AuthContext] OAuth callback error:", error);
      clearAuthData();
      setAuthError(error.message || "Failed to complete authentication");
      return { 
        success: false, 
        error: error.message || "Failed to complete authentication" 
      };
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, fetchUserProfile]);

  const handleSpecialRecruiterLoginSuccess = useCallback(async (email) => {
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
    checkAuthStatus,
    handleGoogleOAuthCallback,
    handleSpecialRecruiterLoginSuccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};