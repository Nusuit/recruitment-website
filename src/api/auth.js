// src/api/auth.js
import axiosInstance from "./config/axiosConfig";

/**
 * @file auth.js
 * @brief This file contains API calls related to authentication.
 */

/**
 * @brief Logs in a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} role - The user's role (e.g., "applicant", "recruiter").
 * @returns {Promise<object>} An object containing success status, token, and/or error message.
 */
const login = async (email, password, role) => {
  try {
    let endpoint = "";
    let payload = {};

    if (role === "recruiter") {
      endpoint = "/auth/recruiter/login";
      payload = { email: email, password: password };
    } else {
      endpoint = "/auth/applicant/login";
      payload = { email: email, password: password };
    }

    const response = await axiosInstance.post(endpoint, payload);

    const { success, message, payload: responsePayload } = response.data || {};

    if (success && responsePayload && responsePayload.accessToken) {
      localStorage.setItem("token", responsePayload.accessToken);
      if (responsePayload.user) {
        localStorage.setItem("user", JSON.stringify(responsePayload.user));
      }
      return {
        success: true,
        token: responsePayload.accessToken,
        user: responsePayload.user,
        isSuperRecruiter: responsePayload.isSuperRecruiter
      };
    } else {
      return {
        success: false,
        error: message || responsePayload?.error || "Login failed: Invalid token or information.",
      };
    }
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @brief Registers a new candidate.
 * @param {object} userData - Object containing candidate registration data (e.g., email, password, firstName, lastName).
 * @returns {Promise<object>} An object containing success status and/or message/error.
 */
const registerCandidate = async (userData) => {
  try {
    const payload = {
      email: userData.email,
      password: userData.password,
    };
    const response = await axiosInstance.post(
      "/auth/applicant/signup",
      payload
    );

    if (response.data && (response.data.success !== undefined ? response.data.success : true)) {
      return {
        success: true,
        message: response.data.message || "Candidate registration successful! Please check your email for verification.",
        email: userData.email,
      };
    } else {
      return {
        success: false,
        error: response.data?.message || "Candidate registration failed from API",
      };
    }
  } catch (error) {
    console.error("[authAPI] registerCandidate error (catch block):", error.response || error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Candidate registration failed",
    };
  }
};

/**
 * @brief Fetches the JWT token for an admin/recruiter session.
 * @returns {Promise<object>} An object containing success status and token, or an error.
 */
const getAdminJwtToken = async () => {
  try {
      const response = await axiosInstance.get('/auth/recruiter/get-jwt');
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
};

/**
 * @brief Verifies a one-time password (OTP).
 * @param {string} email - The user's email.
 * @param {string} otp - The OTP to verify.
 * @returns {Promise<object>} An object containing success status and/or message/error.
 */
const verifyOTP = async (email, otp) => {
  try {
    let verifyUrl = "/auth/applicant/signup/verify";
    const response = await axiosInstance.post(verifyUrl, { email, otp });

    if (response.data && (response.data.success !== undefined ? response.data.success : true)) {
      return {
        success: true,
        message: response.data.message || "OTP verification successful",
      };
    } else {
      return {
        success: false,
        error: response.data?.message || "OTP verification failed from API",
      };
    }
  } catch (error) {
    console.error("[authAPI] verifyOTP error (catch block):", error.response || error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "OTP verification failed",
    };
  }
};

/**
 * @brief Resends a one-time password (OTP).
 * @param {string} email - The user's email.
 * @returns {Promise<object>} An object containing success status and/or message/error.
 */
const resendOTP = async (email) => {
  try {
    let resendUrl = "/auth/applicant/signup/resend-otp";
    const response = await axiosInstance.post(resendUrl, { email });

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || "OTP resend successful",
      };
    } else {
      return {
        success: false,
        error: response.data?.message || "OTP resend failed",
      };
    }
  } catch (error) {
    console.error("[authAPI] resendOTP error (catch block):", error.response || error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Could not resend verification code",
    };
  }
};

/**
 * @brief Requests a password reset link for a given email.
 * @param {string} email - The email address to send the reset link to.
 * @returns {Promise<object>} An object containing success status and/or message/error.
 */
const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return {
      success: true,
      message: response.data.message || "Password reset email has been sent",
    };
  } catch (error) {
    console.error("[authAPI] forgotPassword error:", error.response || error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Password reset request failed",
    };
  }
};

/**
 * @brief Resets the user's password using a token.
 * @param {string} token - The password reset token.
 * @param {string} newPassword - The new password.
 * @returns {Promise<object>} An object containing success status and/or message/error.
 */
const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", { token, newPassword });
    return {
      success: true,
      message: response.data.message || "Password has been reset successfully",
    };
  } catch (error) {
    console.error("[authAPI] resetPassword error:", error.response || error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Password reset failed",
    };
  }
};

/**
 * @brief Handles Google OAuth login callback, exchanging the authorization code for tokens.
 * @param {string} code - The authorization code received from Google.
 * @returns {Promise<object>} An object containing success status, token, and/or error message.
 */
const loginWithGoogleOAuth = async (code) => {
  try {
    let oauthUrl = `/auth/applicant/login/oauth2?code=${code}`;
    const response = await axiosInstance.get(oauthUrl);
    const { success, message, payload: responsePayload } = response.data || {};

    if (success && responsePayload && responsePayload.accessToken) {
      localStorage.setItem("token", responsePayload.accessToken);
      if (responsePayload.user) {
        localStorage.setItem("user", JSON.stringify(responsePayload.user));
      }
      return {
        success: true,
        token: responsePayload.accessToken,
        user: responsePayload.user,
      };
    } else {
      return {
        success: false,
        error: message || responsePayload?.error || "Google OAuth login failed: Invalid token or information.",
      };
    }
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @brief Logs out the current user.
 * @param {string} role - The role of the user logging out.
 * @returns {Promise<object>} An object indicating logout success.
 */
const logout = async (role) => {
  try {
    let endpoint = "";
    if (role === "recruiter") {
      endpoint = "/auth/recruiter/logout";
    } else if (role === "applicant") {
      endpoint = "/auth/applicant/logout";
    }

    if (endpoint) {
      await axiosInstance.post(endpoint, {});
    }
    return { success: true, message: "Logout successful" };
  } catch (error) {
    console.error("[authAPI] API logout error:", error.response || error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Logout failed on API side.",
    };
  }
};

/**
 * @brief Checks if a user is currently authenticated based on local storage.
 * @returns {boolean} True if authenticated, false otherwise.
 */
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!token && !!user;
};

/**
 * @brief Retrieves the current user object from local storage.
 * @returns {object|null} The user object if found and parsed, otherwise null.
 */
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * @brief Fetches the current user's profile from the backend.
 * @returns {Promise<object>} An object containing success status and user payload, or an error.
 */
const getCurrentUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  } catch (error) {
    handleError(error, '[authAPI] getCurrentUserProfile error');
    throw error;
  }
};

/**
 * @brief Handles generic API errors.
 * @param {object} error - The error object from an Axios request.
 * @returns {object} An object with success: false and an error message.
 */
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
  console.error("[authAPI] Error:", errorMessage, error.response?.data || error);
  return { success: false, error: errorMessage };
};

export const authAPI = {
  login,
  registerCandidate,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  loginWithGoogleOAuth,
  logout,
  isAuthenticated,
  getCurrentUser,
  getCurrentUserProfile,
  getAdminJwtToken,
};

export default authAPI;
