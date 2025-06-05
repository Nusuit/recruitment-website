// src/pages/guest/OAuth2RedirectHandler.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner'; // Giả sử bạn có component này

/**
 * @brief Component to handle OAuth2 redirect from Google.
 * It extracts the authorization code and state from the URL
 * and passes them to the AuthContext for further processing.
 */
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleOAuthCallback, isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    // If already authenticated and user data is available, redirect to dashboard
    if (isAuthenticated && user && user.role) {
        let dashboardPath;
        const userRole = user.role?.toLowerCase();
        if (userRole === "recruiter" || userRole === "admin") {
            dashboardPath = "/admin/dashboard";
        } else if (userRole === "applicant") {
            dashboardPath = "/applicant/dashboard";
        } else {
            dashboardPath = "/"; // Fallback for unknown roles
        }
        console.log("[OAuth2RedirectHandler] Already authenticated, navigating to:", dashboardPath);
        navigate(dashboardPath, { replace: true });
        return; // Exit early if already authenticated
    }

    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error'); // Handle potential errors from OAuth provider

    if (code) {
      console.log("[OAuth2RedirectHandler] Code received:", code);
      handleGoogleOAuthCallback(code, state)
        .then(result => {
          if (result.success) {
            console.log("[OAuth2RedirectHandler] OAuth login successful. AuthContext will handle navigation.");
            // Navigation is handled by AuthContext's useEffect after user data is updated
          } else {
            console.error("[OAuth2RedirectHandler] OAuth login failed:", result.error);
            navigate('/login', { state: { error: result.error || "Đăng nhập Google OAuth thất bại." } });
          }
        })
        .catch(err => {
          console.error("[OAuth2RedirectHandler] Error handling OAuth callback:", err);
          navigate('/login', { state: { error: err.message || "Đã xảy ra lỗi khi xử lý đăng nhập Google." } });
        });
    } else if (error) {
      console.error("[OAuth2RedirectHandler] OAuth error from provider:", error);
      navigate('/login', { state: { error: error || "Đăng nhập Google bị hủy hoặc thất bại." } });
    } else {
      console.warn("[OAuth2RedirectHandler] No code or error in OAuth callback URL.");
      navigate('/login', { state: { error: "Không có mã hoặc lỗi từ Google OAuth." } });
    }
  }, [location, navigate, handleGoogleOAuthCallback, isAuthenticated, user]); // Add isAuthenticated and user to dependencies

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <LoadingSpinner />
      <p className="mt-4 text-lg text-gray-700 font-medium">Đang xử lý đăng nhập Google của bạn...</p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
