// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback, useRef } from "react"; // Import useRef
import { authAPI } from "../api";
import axiosInstance from "../api/config/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Thêm ref để theo dõi trạng thái hiện tại của AuthProvider, tránh vòng lặp
  const isInitialCheckDone = useRef(false); 

  const clearAuthData = useCallback(() => {
    console.log("[AuthContext] Clearing auth data. Token removed, user cleared."); // NEW LOG
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
    const vnNames = ['huy', 'kien', 'nguyet', 'tuan', 'anh', 'minh', 'duc', 'hoang', 'phuong', 'thao', 'linh', 'mai', 'trang', 'ha', 'nga', 'thu', 'hang', 'huong', 'lan', 'yen'];
    
    // First try compound names (e.g. huykien)
    for (const name of vnNames) {
      const restOfEmail = emailName.toLowerCase().substring(name.length);
      if (emailName.toLowerCase().startsWith(name) && (
        // Check if the rest starts with another Vietnamese name
        vnNames.some(otherName => restOfEmail.startsWith(otherName)) ||
        // Or if it's followed by numbers/special chars
        /^[0-9_-]/.test(restOfEmail) ||
        restOfEmail.length === 0
      )) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
    
    // Default case - just capitalize the first part
    const possibleName = emailName.match(/^[a-z]+|[0-9]+/i)[0];
    return possibleName.charAt(0).toUpperCase() + possibleName.slice(1).toLowerCase();
  };

  const fetchUserProfile = useCallback(async () => {
    console.log("[AuthContext] fetchUserProfile called. Attempting to get user profile from backend.");
    setAuthError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("[AuthContext] No token found during profile fetch in localStorage. Calling clearAuthData.");
      clearAuthData();
      return { success: false, error: "No token found." };
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("[AuthContext] Axios Authorization header set with token.");

    try {
      const profileResult = await authAPI.getCurrentUserProfile();
      console.log("[AuthContext] GetCurrentUserProfile response received:", profileResult);

      if (profileResult.success && profileResult.payload) {
        const rawUserData = profileResult.payload;
        console.log('[AuthContext] rawUserData:', rawUserData);
        let fetchedUser;

        // Handle recruiter profile response structure
        const userData = rawUserData.user || rawUserData;
        const isSuperRecruiter = rawUserData.isSuperRecruiter || false;

        // Special recruiter email check - must be done first
        if (userData?.email?.toLowerCase() === "hacnguyet108@gmail.com") {
          console.log("[AuthContext] Special recruiter detected - setting as applicant");
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
              console.log("[AuthContext] Extracting name from email:", fetchedUser.email);
              fetchedUser.firstName = extractNameFromEmail(fetchedUser.email);
              console.log("[AuthContext] Extracted firstName:", fetchedUser.firstName);
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

        // Update state and storage chỉ khi có email hợp lệ
        if (fetchedUser.email && fetchedUser.email.trim() !== '') {
          setUser(fetchedUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          console.log("[AuthContext] User profile fetched and set. IsAuthenticated now: true, User role:", fetchedUser.role, "Name:", fetchedUser.firstName);
          return { success: true, user: fetchedUser };
        } else {
          // Nếu không có email, coi như guest
          console.warn('[AuthContext] User profile không có email, clearAuthData');
          clearAuthData();
          return { success: false, error: 'User profile missing email.' };
        }
      } else {
        console.warn("[AuthContext] Token validation failed or user data missing in payload");
        clearAuthData();
        return { 
          success: false, 
          error: profileResult.message || "Token validation failed or user data missing.",
          details: "Expected user profile data in response payload"
        };
      }
    } catch (error) {
      console.error("[AuthContext] Error in fetchUserProfile (API call failed):", error);
      clearAuthData();
      return { 
        success: false, 
        error: error.message || "Failed to fetch user profile.",
        details: "Error occurred while fetching user profile from backend"
      };
    }
  }, [clearAuthData]);

  // Đảm bảo checkAuthStatus là useCallback
  const checkAuthStatus = useCallback(async () => {
    console.log("[AuthContext] checkAuthStatus called. Current loading state:", loading); 
    setAuthError(null);
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    let result;
    // Always check for special recruiter email first
    if (storedUser.email === "hacnguyet108@gmail.com") {
      console.log("[AuthContext] Special recruiter detected during auth check");
      storedUser.role = "recruiter";
      storedUser.isSuperRecruiter = true;
      storedUser.isAdmin = true;
      localStorage.setItem("user", JSON.stringify(storedUser));
    }
    if (token) {
      console.log("[AuthContext] Token found in localStorage. Attempting to validate/fetch profile.");
      result = await fetchUserProfile();
      if (!result.success) {
        console.log("[AuthContext] Profile fetch failed, clearing auth data");
        clearAuthData();
      }
    } else {
      console.log("[AuthContext] No token found in localStorage, treating as guest user");
      clearAuthData();
      result = { success: false, error: "No token found", isGuest: true };
    }
    setLoading(false);
    return result;
  }, [fetchUserProfile, clearAuthData, loading]);

  useEffect(() => {
    // This effect should only run once when the AuthProvider mounts
    if (!isInitialCheckDone.current) {
      isInitialCheckDone.current = true;
      console.log("[AuthContext] AuthProvider mounted. Performing initial auth check.");
      const initialCheck = async () => {
        setLoading(true);
        // First check if we have a stored user that's the special recruiter
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.email === "hacnguyet108@gmail.com") {
          console.log("[AuthContext] Special recruiter detected in stored user");
          storedUser.role = "recruiter";
          storedUser.isSuperRecruiter = true;
          storedUser.isAdmin = true;
          localStorage.setItem("user", JSON.stringify(storedUser));
        }
        const result = await checkAuthStatus();
        if (result.success) {
          console.log("[AuthContext] Initial auth check successful:", result.user?.email);
        } else {
          // Handle guest user case
          if (result.isGuest) {
            console.log("[AuthContext] No authentication found, treating as guest user");
            setIsAuthenticated(false);
            setUser(null);
          } else {
            console.log("[AuthContext] Auth check failed:", result.error);
            clearAuthData();
          }
        }
        setLoading(false);
      };
      initialCheck();
    }
    // Không return gì ở đây (chỉ return function cleanup nếu cần)
  }, [checkAuthStatus, clearAuthData]);


  const login = useCallback(async (email, password, role) => {
    console.log("[AuthContext] Attempting login with credentials:", { email, role }); // NEW LOG
    setLoading(true); // Start loading for login operation
    setAuthError(null);

    try {
      const result = await authAPI.login(email, password, role);
      console.log("[AuthContext] Login API result:", result); // NEW LOG

      if (result && result.success && result.token) {
        // Token and user should already be in localStorage from authAPI.login
        // Now, confirm by fetching profile
        const profileFetchResult = await fetchUserProfile();
        if (profileFetchResult.success) { 
          console.log("[AuthContext] Login successful. User profile fetched after credential login."); // NEW LOG
          return { success: true, user: profileFetchResult.user }; 
        } else {
          console.warn("[AuthContext] Failed to fetch user profile after credential login, but token seems valid:", profileFetchResult.error); // NEW LOG
          clearAuthData();
          return { success: false, error: profileFetchResult.error || "Login successful but failed to fetch user profile." };
        }
      } else {
        console.log("[AuthContext] Login failed via credentials. Error:", result?.error); // NEW LOG
        clearAuthData();
        return { success: false, error: result?.error || "Email or password invalid." };
      }
    } catch (error) {
      console.error("[AuthContext] Login context error (credentials):", error.response?.status, error.message); // NEW LOG
      setAuthError(error.message || "Login failed due to an unexpected error.");
      clearAuthData();
      return { success: false, error: error.message || "Login failed due to an unexpected error." };
    } finally {
      setLoading(false); // End loading for login operation
      console.log("[AuthContext] Login process finished.");
    }
  }, [clearAuthData, fetchUserProfile]);

  const signup = useCallback(async (userData) => {
    console.log("[AuthContext] Attempting signup with userData:", userData.email);
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
      console.error("[AuthContext] Signup context error (catch block):", error.response || error);
      setAuthError(error.message || "Signup failed. Please try again.");
      return { success: false, error: error.message || "Signup failed." };
    } finally {
      setLoading(false);
      console.log("[AuthContext] Signup process finished.");
    }
  }, []);

  const logout = useCallback(async () => {
    console.log("[AuthContext] Logging out. Current user role:", user?.role); // NEW LOG
    setLoading(true);
    setAuthError(null);
    try {
      const currentUserRole = user?.role?.toLowerCase();
      await authAPI.logout(currentUserRole);
    }
    catch (error) {
      console.error("[AuthContext] API logout error:", error.response || error); // NEW LOG
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
      console.error("[AuthContext] Forgot password error:", error.response || error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    console.log("[AuthContext] Initiating Google login. Redirecting to backend OAuth endpoint."); // NEW LOG
    const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
    const backendBaseUrl = apiBaseUrl.replace('/api', '');

    const authorizeUrl = `${backendBaseUrl}/oauth2/authorization/google`; 
    
    window.location.href = authorizeUrl; // Direct browser redirect
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    console.log("[AuthContext] Verifying OTP for:", email); // NEW LOG
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.verifyOTP(email, otp);
      console.log("[AuthContext] Verify OTP API result:", result);
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
    console.log("[AuthContext] Resending OTP for:", email); // NEW LOG
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.resendOTP(email);
      console.log("[AuthContext] Resend OTP API result:", result);
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
    console.log("[AuthContext] Updating user context with partial data:", updatedUserData); // NEW LOG
    setUser(prevUser => {
        const newUser = { ...prevUser, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
    });
  }, []);

  const handleGoogleOAuthCallback = useCallback(async (token) => {
    console.log("[AuthContext] Processing OAuth token");
    setLoading(true);
    setAuthError(null);
    try {
      // Validate token
      if (!token) {
        console.error("[AuthContext] No token provided for OAuth callback");
        throw new Error("Không nhận được token xác thực");
      }

      // Clear any existing auth data
      clearAuthData();
      
      // Set up authentication with new token
      console.log("[AuthContext] Setting up OAuth authentication");
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);

      // Fetch and set up user profile
      console.log("[AuthContext] Fetching user profile");
      const profileResult = await fetchUserProfile();
      console.log("[AuthContext] Profile fetch result:", profileResult);

      if (profileResult.success && profileResult.user) {
        console.log("[AuthContext] OAuth login successful, user:", profileResult.user.email, "role:", profileResult.user.role);
        return { success: true, user: profileResult.user };
      } else {
        console.error("[AuthContext] Failed to get user profile:", profileResult.error);
        clearAuthData();
        throw new Error("Không thể lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("[AuthContext] handleGoogleOAuthCallback error:", error.response?.status, error.message);
      setAuthError(error.message || "Failed to complete Google login.");
      clearAuthData();
      return { success: false, error: error.message || "Failed to complete Google login." };
    } finally {
      setLoading(false);
      console.log("[AuthContext] handleGoogleOAuthCallback finished.");
    }
  }, [clearAuthData, fetchUserProfile]);


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
    checkAuthStatus,
    handleGoogleOAuthCallback,
    handleSpecialRecruiterLoginSuccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};